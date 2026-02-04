#!/bin/bash
# PRINTGUYS AGENT LAUNCHER
# Launches multiple z-code agents in parallel
# Created: 2026-01-26

set -e

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
TASKS_DIR="$PROJECT_DIR/z-code-tasks"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"
LOGS_DIR="$PROJECT_DIR/z-code-logs"
MANAGER_DIR="$PROJECT_DIR/z-code-manager"

LOG_FILE="$MANAGER_DIR/launch.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== LAUNCHING AGENTS =========="

# Check z-code availability
if ! command -v z-code &> /dev/null; then
    log "ERROR: z-code not found. Please install z-code first."
    exit 1
fi

# Function to launch an agent for a specific task
launch_task() {
    local task_id=$1
    local agent_id=$2
    local task_file="$TASKS_DIR/${task_id}.md"
    local output_file="$OUTPUTS_DIR/${agent_id}-${task_id}.md"
    local log_file="$LOGS_DIR/${agent_id}.log"
    local pid_file="$LOGS_DIR/${agent_id}.pid"

    if [ ! -f "$task_file" ]; then
        log "ERROR: Task file not found: $task_file"
        return 1
    fi

    log "Launching $agent_id for task $task_id..."

    # Read task prompt
    local prompt=$(cat "$task_file")

    # Launch z-code in background
    nohup z-code -p "$prompt" --output-file "$output_file" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$pid_file"

    log "$agent_id started with PID $pid"
    sleep 2  # Give agent time to start
}

# Phase 1: Critical Backend (can run in parallel - no dependencies between these initial tasks)
log "=== PHASE 1: Critical Backend ==="

# Agent 1: Database setup (T001 -> T002 -> T003)
launch_task "T001" "agent1"

# Agent 2: Email setup (T004 -> T005)
launch_task "T004" "agent2"

# Agent 4: Cart (no dependencies)
launch_task "T008" "agent4"

# Agent 8: SEO/Polish (no dependencies)
launch_task "T020" "agent8"

log "========== INITIAL AGENTS LAUNCHED =========="
log "Phase 1 agents started. Manager cron will handle subsequent tasks."
log ""
log "Monitor progress:"
log "  - View status: cat $MANAGER_DIR/status.json"
log "  - View tasks: cat $MANAGER_DIR/tasks.json"
log "  - View logs: tail -f $LOGS_DIR/agent*.log"
log "  - View outputs: ls -la $OUTPUTS_DIR/"
