#!/bin/bash
# PRINTGUYS MONITORING AGENT
# Continuously monitors progress and restarts failed agents
# Run with: nohup ./monitor-agent.sh &

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"
TASKS_DIR="$PROJECT_DIR/z-code-tasks"
LOG_FILE="$PROJECT_DIR/z-code-manager/monitor.log"

# All tasks
ALL_TASKS="T005 T009 T010 T011 T012 T013 T014 T016 T017 T018 T019 T024 T025"
# Tasks completed before this run
ALREADY_DONE="T004 T008 T015 T020 T021 T022 T023"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

is_completed() {
    local task=$1
    grep -q "TASK_COMPLETED" "$OUTPUTS_DIR"/*${task}*.md 2>/dev/null
}

is_running() {
    local task=$1
    ps aux | grep "$task.md" | grep -v grep > /dev/null 2>&1
}

launch_task() {
    local task=$1
    log "LAUNCHING: $task"
    cd "$PROJECT_DIR"
    nohup z-code -p "Read and execute task at $TASKS_DIR/${task}.md. Write TASK_COMPLETED when done." > "$OUTPUTS_DIR/agent-${task}.md" 2>&1 &
    sleep 3
}

log "=========================================="
log "    MONITORING AGENT STARTED"
log "=========================================="

iteration=0
while true; do
    ((iteration++))
    log ""
    log "=== CHECK #$iteration ==="

    # Count stats
    completed=0
    running=0
    pending=0

    for task in $ALL_TASKS; do
        if is_completed "$task"; then
            ((completed++))
            log "  $task: COMPLETED"
        elif is_running "$task"; then
            ((running++))
            log "  $task: RUNNING"
        else
            ((pending++))
            log "  $task: PENDING - Launching..."
            launch_task "$task"
        fi
    done

    # Add already completed tasks
    for task in $ALREADY_DONE; do
        ((completed++))
    done

    total=$((completed + running + pending))
    pct=$((completed * 100 / 25))

    log ""
    log "PROGRESS: $completed/25 ($pct%)"
    log "Running: $running | Pending: $pending"
    log "Active claude processes: $(ps aux | grep 'claude.*-p' | grep -v grep | wc -l)"

    # Check if all done
    if [ $completed -ge 25 ]; then
        log ""
        log "=========================================="
        log "    ALL TASKS COMPLETED!"
        log "=========================================="
        break
    fi

    # Wait before next check
    sleep 120  # Check every 2 minutes
done

log "Monitor agent finished."
