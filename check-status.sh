#!/bin/bash
# Quick status check for Printguys completion

cd /home/nick/Nick/Printguys-AI/printguys-nextjs/z-code-outputs

echo "╔══════════════════════════════════════════╗"
echo "║     PRINTGUYS COMPLETION STATUS          ║"
echo "║     $(date '+%Y-%m-%d %H:%M:%S')              ║"
echo "╚══════════════════════════════════════════╝"
echo ""

completed=0
pending=0
db_blocked=0

for task in T001 T002 T003 T004 T005 T006 T007 T008 T009 T010 T011 T012 T013 T014 T015 T016 T017 T018 T019 T020 T021 T022 T023 T024 T025; do
    if grep -q "TASK_COMPLETED" *${task}*.md 2>/dev/null; then
        echo "  $task: ✅ DONE"
        ((completed++))
    elif [[ "$task" =~ ^(T001|T002|T003|T006|T007)$ ]]; then
        echo "  $task: 🔒 NEEDS DATABASE"
        ((db_blocked++))
    else
        size=$(cat *${task}*.md 2>/dev/null | wc -c)
        if [ "$size" -gt 500 ]; then
            echo "  $task: 🔄 IN PROGRESS"
        else
            echo "  $task: ⏳ PENDING"
        fi
        ((pending++))
    fi
done

echo ""
echo "════════════════════════════════════════════"
pct=$((completed * 100 / 25))
echo "COMPLETED: $completed/25 ($pct%)"
echo "RUNNING AGENTS: $(ps aux | grep 'claude.*-p' | grep -v grep | wc -l)"
echo "DB BLOCKED: $db_blocked (need PostgreSQL)"
echo "════════════════════════════════════════════"

if [ $db_blocked -gt 0 ]; then
    echo ""
    echo "⚠️  To complete database tasks, run:"
    echo "    sudo apt-get install -y postgresql postgresql-contrib"
    echo "    sudo systemctl start postgresql"
fi
