#!/bin/bash
# PRINTGUYS Z-CODE ORCHESTRATOR
# Manages agent deployment and monitors progress
# Runs continuously until all tasks complete

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"
TASKS_DIR="$PROJECT_DIR/z-code-tasks"
LOG_FILE="$PROJECT_DIR/z-code-manager/orchestrator.log"

MAX_CONCURRENT_AGENTS=6  # Limit to prevent overload

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

count_running() {
    ps aux | grep "z-code -p\|claude.*-p" | grep -v grep | wc -l
}

is_completed() {
    local task=$1
    grep -q "TASK_COMPLETED" "$OUTPUTS_DIR"/*${task}*.md 2>/dev/null
}

launch_task() {
    local task=$1
    log "Launching $task..."
    cd "$PROJECT_DIR"
    nohup z-code -p "Read and execute task at $TASKS_DIR/${task}.md. Write TASK_COMPLETED when done." > "$OUTPUTS_DIR/agent-${task}.md" 2>&1 &
    echo $! > "$PROJECT_DIR/z-code-logs/${task}.pid"
    log "$task launched with PID $!"
}

# Tasks with no dependencies (can run anytime)
NO_DEP_TASKS="T005 T009 T010 T011 T024 T025"

# Tasks needing database
DB_TASKS="T002 T003 T006 T007 T012 T013 T014 T016 T017 T018 T019"

log "========== ORCHESTRATOR STARTED =========="
log "Max concurrent agents: $MAX_CONCURRENT_AGENTS"

while true; do
    running=$(count_running)
    log "Running agents: $running"

    # Count completed
    completed=0
    for task in T001 T002 T003 T004 T005 T006 T007 T008 T009 T010 T011 T012 T013 T014 T015 T016 T017 T018 T019 T020 T021 T022 T023 T024 T025; do
        if is_completed "$task"; then
            ((completed++))
        fi
    done
    log "Completed tasks: $completed/25"

    # Check if all done
    if [ $completed -eq 25 ]; then
        log "ALL TASKS COMPLETED!"
        break
    fi

    # Launch more agents if under limit
    if [ $running -lt $MAX_CONCURRENT_AGENTS ]; then
        slots=$((MAX_CONCURRENT_AGENTS - running))
        log "Available slots: $slots"

        for task in $NO_DEP_TASKS; do
            if [ $slots -le 0 ]; then break; fi
            if ! is_completed "$task"; then
                # Check if already running
                if ! ps aux | grep "$task.md" | grep -v grep > /dev/null 2>&1; then
                    launch_task "$task"
                    ((slots--))
                    sleep 2
                fi
            fi
        done
    fi

    # Status update
    log "--- Status Check Complete ---"
    sleep 60  # Check every minute
done

log "========== ORCHESTRATOR FINISHED =========="
