with open('src/components/MainApp.tsx', 'r') as f:
    text = f.read()

import re

# Block 1
text = re.sub(
    r'const acwr = p\.metrics\?\.acwr \|\| 1\.0;\s*const sleep = p\.metrics\?\.sleep \|\| 6\.0;\s*const leftValues = p\.gripChartData\?\.leftValues \|\| \[\];\s*const gripLeftToday = leftValues\[leftValues\.length - 1\] \|\| 50;\s*const gripLeftBaseline = leftValues\[0\] \|\| 50;\s*const leftChange = gripLeftBaseline !== 0 \? \(\(gripLeftToday - gripLeftBaseline\) / gripLeftBaseline\) \* 100 : 0;\s*const rightValues = p\.gripChartData\?\.rightValues \|\| \[\];\s*const gripRightToday = rightValues\[rightValues\.length - 1\] \|\| 50;\s*const gripRightBaseline = rightValues\[0\] \|\| 50;\s*const rightChange = gripRightBaseline !== 0 \? \(\(gripRightToday - gripRightBaseline\) / gripRightBaseline\) \* 100 : 0;\s*const statusInfo = getComprehensiveStatus\(acwr, sleep, leftChange, rightChange, false\);',
    r'''const acwr = p.metrics?.acwr || 0;
          const sleep = p.sleepChartData?.length ? p.sleepChartData[p.sleepChartData.length - 1].sleepDuration : 0;
          
          const leftValues = p.gripChartData?.leftValues || [];
          const gripLeftToday = leftValues[leftValues.length - 1] || 0;
          const gripLeftBaseline = leftValues[0] || 0;
          const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
          
          const rightValues = p.gripChartData?.rightValues || [];
          const gripRightToday = rightValues[rightValues.length - 1] || 0;
          const gripRightBaseline = rightValues[0] || 0;
          const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
          
          const isEmpty = acwr === 0 && sleep === 0 && gripLeftToday === 0 && gripRightToday === 0;
          const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, isEmpty);''',
    text
)

# Block 2
text = re.sub(
    r'const acwr = activePlayer\.metrics\?\.acwr \|\| 1\.0;\s*const sleep = activePlayer\.metrics\?\.sleep \|\| 6\.0;\s*const leftValues = activePlayer\.gripChartData\?\.leftValues \|\| \[\];\s*const gripLeftToday = leftValues\[leftValues\.length - 1\] \|\| 50;\s*const gripLeftBaseline = leftValues\[0\] \|\| 50;\s*const leftChange = gripLeftBaseline !== 0 \? \(\(gripLeftToday - gripLeftBaseline\) / gripLeftBaseline\) \* 100 : 0;\s*const rightValues = activePlayer\.gripChartData\?\.rightValues \|\| \[\];\s*const gripRightToday = rightValues\[rightValues\.length - 1\] \|\| 50;\s*const gripRightBaseline = rightValues\[0\] \|\| 50;\s*const rightChange = gripRightBaseline !== 0 \? \(\(gripRightToday - gripRightBaseline\) / gripRightBaseline\) \* 100 : 0;\s*const statusInfo = getComprehensiveStatus\(acwr, sleep, leftChange, rightChange, false\);',
    r'''const acwr = activePlayer.metrics?.acwr || 0;
              const sleep = activePlayer.sleepChartData?.length ? activePlayer.sleepChartData[activePlayer.sleepChartData.length - 1].sleepDuration : 0;
              
              const leftValues = activePlayer.gripChartData?.leftValues || [];
              const gripLeftToday = leftValues[leftValues.length - 1] || 0;
              const gripLeftBaseline = leftValues[0] || 0;
              const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
              
              const rightValues = activePlayer.gripChartData?.rightValues || [];
              const gripRightToday = rightValues[rightValues.length - 1] || 0;
              const gripRightBaseline = rightValues[0] || 0;
              const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
              
              const isEmpty = acwr === 0 && sleep === 0 && gripLeftToday === 0 && gripRightToday === 0;
              const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, isEmpty);''',
    text
)

with open('src/components/MainApp.tsx', 'w') as f:
    f.write(text)

print("Done")
