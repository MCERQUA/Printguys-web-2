#!/bin/bash
# PRINTGUYS PROGRESS CHECKER
# Quick status check for the autonomous work system

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
MANAGER_DIR="$PROJECT_DIR/z-code-manager"
LOGS_DIR="$PROJECT_DIR/z-code-logs"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"
TASKS_FILE="$MANAGER_DIR/tasks.json"

echo "============================================"
echo "    PRINTGUYS COMPLETION STATUS"
echo "    $(date)"
echo "============================================"
echo ""

# Overall progress
if [ -f "$TASKS_FILE" ]; then
    completed=$(jq '.stats.completed' "$TASKS_FILE")
    total=$(jq '.stats.totalTasks' "$TASKS_FILE")
    in_progress=$(jq '.stats.inProgress' "$TASKS_FILE")
    pending=$(jq '.stats.pending' "$TASKS_FILE")

    progress=$((completed * 100 / total))

    echo "PROGRESS: $completed / $total tasks ($progress%)"
    echo ""
    echo "  Completed:   $completed"
    echo "  In Progress: $in_progress"
    echo "  Pending:     $pending"
    echo ""
fi

# Active agents
echo "ACTIVE AGENTS:"
for pid_file in "$LOGS_DIR"/*.pid; do
    if [ -f "$pid_file" ]; then
        agent_name=$(basename "$pid_file" .pid)
        pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo "  $agent_name: RUNNING (PID $pid)"
        else
            echo "  $agent_name: STOPPED"
        fi
    fi
done
echo ""

# Recent outputs
echo "RECENT OUTPUTS:"
ls -lt "$OUTPUTS_DIR"/*.md 2>/dev/null | head -5 | while read line; do
    echo "  $line"
done
echo ""

# Check for errors in logs
echo "RECENT ERRORS (if any):"
grep -l "ERROR\|FAILED\|error\|failed" "$LOGS_DIR"/*.log 2>/dev/null | head -3 | while read log; do
    echo "  Found in: $(basename $log)"
    grep -m 2 "ERROR\|FAILED\|error\|failed" "$log" | head -2
done

echo ""
echo "============================================"
echo "Commands:"
echo "  Full logs:  tail -f $LOGS_DIR/*.log"
echo "  Restart:    $MANAGER_DIR/launch-agents.sh"
echo "  Manual run: $MANAGER_DIR/manager.sh"
echo "============================================"
