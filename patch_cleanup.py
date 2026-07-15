import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  useEffect(() => {
    if (activePlayerId && !allPlayers[activePlayerId] && !isLoading) {
      setActivePlayerId(isAgent ? null : currentUser.userId);
    }
  }, [activePlayerId, allPlayers, isAgent, currentUser, isLoading]);"""

replacement = """  useEffect(() => {
    if (activePlayerId && !allPlayers[activePlayerId] && !isLoading) {
      setActivePlayerId(isAgent ? null : currentUser.userId);
    }
  }, [activePlayerId, allPlayers, isAgent, currentUser, isLoading]);

  useEffect(() => {
    if (activePlayer && activePlayer.schedules) {
      const hasInvalidSchedules = activePlayer.schedules.some((s: any) => s.date && s.date.length > 5);
      if (hasInvalidSchedules) {
        const cleanedPlayer = rebuildChartsFromSchedules(activePlayer);
        updatePlayer(activePlayer.id, cleanedPlayer);
      }
    }
  }, [activePlayer]);"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found!")

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
