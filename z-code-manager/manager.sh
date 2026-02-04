#!/bin/bash
# PRINTGUYS Z-CODE MANAGER
# Runs every 5 minutes via cron to ensure agents stay running
# Created: 2026-01-26

set -e

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
MANAGER_DIR="$PROJECT_DIR/z-code-manager"
LOGS_DIR="$PROJECT_DIR/z-code-logs"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"
TASKS_DIR="$PROJECT_DIR/z-code-tasks"

LOG_FILE="$MANAGER_DIR/manager.log"
STATUS_FILE="$MANAGER_DIR/status.json"
TASKS_FILE="$MANAGER_DIR/tasks.json"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "========== MANAGER CHECK STARTED =========="

# Check if z-code is available
if ! command -v z-code &> /dev/null; then
    log "ERROR: z-code command not found!"
    exit 1
fi

# Function to check if an agent is running
check_agent() {
    local agent_name=$1
    local pid_file="$LOGS_DIR/${agent_name}.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0  # Running
        fi
    fi
    return 1  # Not running
}

# Function to get next pending task for an agent
get_next_task() {
    local agent_id=$1
    # Use jq to find next pending task for this agent
    jq -r --arg agent "$agent_id" '
        .phases[].tasks[] |
        select(.agent == $agent and .status == "pending") |
        .id' "$TASKS_FILE" | head -1
}

# Function to check if task dependencies are met
check_dependencies() {
    local task_id=$1
    local deps=$(jq -r --arg tid "$task_id" '
        .phases[].tasks[] |
        select(.id == $tid) |
        .dependencies[]' "$TASKS_FILE" 2>/dev/null)

    if [ -z "$deps" ]; then
        return 0  # No dependencies
    fi

    for dep in $deps; do
        local dep_status=$(jq -r --arg did "$dep" '
            .phases[].tasks[] |
            select(.id == $did) |
            .status' "$TASKS_FILE")
        if [ "$dep_status" != "completed" ]; then
            return 1  # Dependency not met
        fi
    done
    return 0  # All dependencies met
}

# Function to launch an agent
launch_agent() {
    local agent_id=$1
    local task_id=$2
    local task_name=$(jq -r --arg tid "$task_id" '.phases[].tasks[] | select(.id == $tid) | .name' "$TASKS_FILE")

    log "Launching $agent_id for task $task_id: $task_name"

    # Get the task prompt from task definitions
    local task_prompt_file="$TASKS_DIR/${task_id}.md"

    if [ ! -f "$task_prompt_file" ]; then
        log "ERROR: Task prompt file not found: $task_prompt_file"
        return 1
    fi

    local prompt=$(cat "$task_prompt_file")
    local output_file="$OUTPUTS_DIR/${agent_id}-${task_id}.md"
    local log_file="$LOGS_DIR/${agent_id}.log"
    local pid_file="$LOGS_DIR/${agent_id}.pid"

    # Launch z-code in background
    nohup z-code -p "$prompt" --output-file "$output_file" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$pid_file"

    # Update tasks.json
    local tmp_file=$(mktemp)
    jq --arg agent "$agent_id" --arg task "$task_id" --arg pid "$pid" '
        .agents[$agent].status = "running" |
        .agents[$agent].currentTask = $task |
        .agents[$agent].pid = ($pid | tonumber) |
        (.phases[].tasks[] | select(.id == $task)).status = "in_progress" |
        .stats.inProgress += 1 |
        .stats.pending -= 1 |
        .lastUpdated = (now | todate)
    ' "$TASKS_FILE" > "$tmp_file" && mv "$tmp_file" "$TASKS_FILE"

    log "Agent $agent_id started with PID $pid"
}

# Function to check if agent completed its task
check_agent_completion() {
    local agent_id=$1
    local output_file=$(ls -t "$OUTPUTS_DIR/${agent_id}-"*.md 2>/dev/null | head -1)

    if [ -n "$output_file" ] && [ -f "$output_file" ]; then
        # Check if output contains completion marker
        if grep -q "TASK_COMPLETED" "$output_file" 2>/dev/null; then
            return 0  # Completed
        fi
    fi
    return 1  # Not completed
}

# Main loop - check each agent
AGENTS=("agent1" "agent2" "agent3" "agent4" "agent5" "agent6" "agent7" "agent8")

for agent in "${AGENTS[@]}"; do
    log "Checking $agent..."

    if check_agent "$agent"; then
        log "$agent is running"

        # Check if task completed
        if check_agent_completion "$agent"; then
            current_task=$(jq -r --arg agent "$agent" '.agents[$agent].currentTask' "$TASKS_FILE")
            log "$agent completed task $current_task"

            # Update task status
            tmp_file=$(mktemp)
            jq --arg agent "$agent" --arg task "$current_task" '
                .agents[$agent].status = "idle" |
                .agents[$agent].currentTask = null |
                .agents[$agent].pid = null |
                (.phases[].tasks[] | select(.id == $task)).status = "completed" |
                .stats.completed += 1 |
                .stats.inProgress -= 1 |
                .lastUpdated = (now | todate)
            ' "$TASKS_FILE" > "$tmp_file" && mv "$tmp_file" "$TASKS_FILE"
        fi
    else
        log "$agent is not running"

        # Get next task for this agent
        next_task=$(get_next_task "$agent")

        if [ -n "$next_task" ]; then
            # Check dependencies
            if check_dependencies "$next_task"; then
                log "Dependencies met for $next_task, launching $agent"
                launch_agent "$agent" "$next_task"
            else
                log "Dependencies not met for $next_task, skipping"
            fi
        else
            log "No pending tasks for $agent"
        fi
    fi
done

# Update status file
completed=$(jq '.stats.completed' "$TASKS_FILE")
total=$(jq '.stats.totalTasks' "$TASKS_FILE")
progress=$((completed * 100 / total))

cat > "$STATUS_FILE" << EOF
{
  "lastCheck": "$(date -Iseconds)",
  "completed": $completed,
  "total": $total,
  "progress": $progress,
  "status": "$([ $completed -eq $total ] && echo 'complete' || echo 'in_progress')"
}
EOF

log "Progress: $completed/$total ($progress%)"
log "========== MANAGER CHECK COMPLETED =========="

# If all tasks complete, disable cron
if [ $completed -eq $total ]; then
    log "ALL TASKS COMPLETED! Disabling cron job."
    crontab -l | grep -v "printguys.*manager.sh" | crontab -
fi
