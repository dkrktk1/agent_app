import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """          const acwr = p.metrics?.acwr || 1.0;
          const sleep = p.metrics?.sleep || 6.0;
             
          const leftValues = p.gripChartData?.leftValues || [];
          const gripLeftToday = leftValues[leftValues.length - 1] || 50;
          const gripLeftBaseline = leftValues[0] || 50;
          const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
             
          const rightValues = p.gripChartData?.rightValues || [];
          const gripRightToday = rightValues[rightValues.length - 1] || 50;
          const gripRightBaseline = rightValues[0] || 50;
          const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
             
          const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, false);"""

replace1 = """          const acwr = p.metrics?.acwr || 0;
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
          const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, isEmpty);"""

content = content.replace(target1, replace1)

target2 = """              const acwr = activePlayer.metrics?.acwr || 1.0;
              const sleep = activePlayer.metrics?.sleep || 6.0;
                 
              const leftValues = activePlayer.gripChartData?.leftValues || [];
              const gripLeftToday = leftValues[leftValues.length - 1] || 50;
              const gripLeftBaseline = leftValues[0] || 50;
              const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
                 
              const rightValues = activePlayer.gripChartData?.rightValues || [];
              const gripRightToday = rightValues[rightValues.length - 1] || 50;
              const gripRightBaseline = rightValues[0] || 50;
              const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
                 
              const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, false);"""

replace2 = """              const acwr = activePlayer.metrics?.acwr || 0;
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
              const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, isEmpty);"""

content = content.replace(target2, replace2)

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
