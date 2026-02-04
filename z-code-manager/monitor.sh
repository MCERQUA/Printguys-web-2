#!/bin/bash
# PRINTGUYS REAL-TIME MONITOR
# Shows live status of all z-code agents

PROJECT_DIR="/home/nick/Nick/Printguys-AI/printguys-nextjs"
OUTPUTS_DIR="$PROJECT_DIR/z-code-outputs"

clear
echo "============================================"
echo "    PRINTGUYS Z-CODE AGENT MONITOR"
echo "    $(date)"
echo "============================================"
echo ""

# Count running agents
running=$(ps aux | grep "claude.*-p" | grep -v grep | wc -l)
echo "RUNNING AGENTS: $running"
echo ""

# Show each agent status
echo "AGENT STATUS:"
echo "-------------"

for output in "$OUTPUTS_DIR"/*.md; do
    if [ -f "$output" ]; then
        filename=$(basename "$output")
        size=$(stat -c%s "$output" 2>/dev/null || echo "0")

        if [ "$size" -gt 0 ]; then
            if grep -q "TASK_COMPLETED" "$output" 2>/dev/null; then
                status="COMPLETED"
            elif grep -q "TASK_FAILED" "$output" 2>/dev/null; then
                status="FAILED"
            else
                status="IN PROGRESS ($size bytes)"
            fi
        else
            # Check if process is running
            task_id=$(echo "$filename" | grep -oP 'T\d+' | head -1)
            if ps aux | grep "z-code-tasks/${task_id}.md" | grep -v grep > /dev/null 2>&1; then
                status="RUNNING (no output yet)"
            else
                status="PENDING"
            fi
        fi

        printf "  %-25s %s\n" "$filename" "$status"
    fi
done

echo ""
echo "COMPLETED TASKS:"
completed=0
for output in "$OUTPUTS_DIR"/*.md; do
    if grep -q "TASK_COMPLETED" "$output" 2>/dev/null; then
        echo "  - $(basename $output)"
        ((completed++))
    fi
done
[ $completed -eq 0 ] && echo "  (none yet)"

echo ""
echo "============================================"
echo "Total: 25 tasks | Completed: $completed | Running: $running"
echo "============================================"
