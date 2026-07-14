#!/bin/bash
sed -i -e '/{isDailyLogOpen && (/i \
      {showPastGripModal && renderPastHistoryModal("grip")}\
      {showPastSleepModal && renderPastHistoryModal("sleep")}
' src/components/CareTab.tsx
