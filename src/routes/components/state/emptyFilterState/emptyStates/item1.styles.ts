import type React from 'react';

export const styles = {
  item: {
    content:
      'url("data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MTMgMTQ1Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2UwMDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPlJlZEhhdC1Mb2dvLUEtQ29sb3I8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyNy40Nyw4My40OWMxMi41MSwwLDMwLjYxLTIuNTgsMzAuNjEtMTcuNDZhMTQsMTQsMCwwLDAtLjMxLTMuNDJsLTcuNDUtMzIuMzZjLTEuNzItNy4xMi0zLjIzLTEwLjM1LTE1LjczLTE2LjZDMTI0Ljg5LDguNjksMTAzLjc2LjUsOTcuNTEuNSw5MS42OS41LDkwLDgsODMuMDYsOGMtNi42OCwwLTExLjY0LTUuNi0xNy44OS01LjYtNiwwLTkuOTEsNC4wOS0xMi45MywxMi41LDAsMC04LjQxLDIzLjcyLTkuNDksMjcuMTZBNi40Myw2LjQzLDAsMCwwLDQyLjUzLDQ0YzAsOS4yMiwzNi4zLDM5LjQ1LDg0Ljk0LDM5LjQ1TTE2MCw3Mi4wN2MxLjczLDguMTksMS43Myw5LjA1LDEuNzMsMTAuMTMsMCwxNC0xNS43NCwyMS43Ny0zNi40MywyMS43N0M3OC41NCwxMDQsMzcuNTgsNzYuNiwzNy41OCw1OC40OWExOC40NSwxOC40NSwwLDAsMSwxLjUxLTcuMzNDMjIuMjcsNTIsLjUsNTUsLjUsNzQuMjJjMCwzMS40OCw3NC41OSw3MC4yOCwxMzMuNjUsNzAuMjgsNDUuMjgsMCw1Ni43LTIwLjQ4LDU2LjctMzYuNjUsMC0xMi43Mi0xMS0yNy4xNi0zMC44My0zNS43OCIvPjxwYXRoIGQ9Ik0xNjAsNzIuMDdjMS43Myw4LjE5LDEuNzMsOS4wNSwxLjczLDEwLjEzLDAsMTQtMTUuNzQsMjEuNzctMzYuNDMsMjEuNzdDNzguNTQsMTA0LDM3LjU4LDc2LjYsMzcuNTgsNTguNDlhMTguNDUsMTguNDUsMCwwLDEsMS41MS03LjMzbDMuNjYtOS4wNkE2LjQzLDYuNDMsMCwwLDAsNDIuNTMsNDRjMCw5LjIyLDM2LjMsMzkuNDUsODQuOTQsMzkuNDUsMTIuNTEsMCwzMC42MS0yLjU4LDMwLjYxLTE3LjQ2YTE0LDE0LDAsMCwwLS4zMS0zLjQyWiIvPjxwYXRoIGQ9Ik01NzkuNzQsOTIuOGMwLDExLjg5LDcuMTUsMTcuNjcsMjAuMTksMTcuNjdhNTIuMTEsNTIuMTEsMCwwLDAsMTEuODktMS42OFY5NWEyNC44NCwyNC44NCwwLDAsMS03LjY4LDEuMTZjLTUuMzcsMC03LjM2LTEuNjgtNy4zNi02LjczVjY4LjNoMTUuNTZWNTQuMUg1OTYuNzh2LTE4bC0xNywzLjY4VjU0LjFINTY4LjQ5VjY4LjNoMTEuMjVabS01MywuMzJjMC0zLjY4LDMuNjktNS40Nyw5LjI2LTUuNDdhNDMuMTIsNDMuMTIsMCwwLDEsMTAuMSwxLjI2djcuMTVhMjEuNTEsMjEuNTEsMCwwLDEtMTAuNjMsMi42M2MtNS40NiwwLTguNzMtMi4xLTguNzMtNS41N201LjIsMTcuNTZjNiwwLDEwLjg0LTEuMjYsMTUuMzYtNC4zMXYzLjM3aDE2LjgyVjc0LjA4YzAtMTMuNTYtOS4xNC0yMS0yNC4zOS0yMS04LjUyLDAtMTYuOTQsMi0yNiw2LjFsNi4xLDEyLjUyYzYuNTItMi43NCwxMi00LjQyLDE2LjgzLTQuNDIsNywwLDEwLjYyLDIuNzMsMTAuNjIsOC4zMXYyLjczYTQ5LjUzLDQ5LjUzLDAsMCwwLTEyLjYyLTEuNThjLTE0LjMxLDAtMjIuOTMsNi0yMi45MywxNi43MywwLDkuNzgsNy43OCwxNy4yNCwyMC4xOSwxNy4yNG0tOTIuNDQtLjk0aDE4LjA5VjgwLjkyaDMwLjI5djI4LjgySDUwNlYzNi4xMkg0ODcuOTNWNjQuNDFINDU3LjY0VjM2LjEySDQzOS41NVpNMzcwLjYyLDgxLjg3YzAtOCw2LjMxLTE0LjEsMTQuNjItMTQuMUExNy4yMiwxNy4yMiwwLDAsMSwzOTcsNzIuMDlWOTEuNTRBMTYuMzYsMTYuMzYsMCwwLDEsMzg1LjI0LDk2Yy04LjIsMC0xNC42Mi02LjEtMTQuNjItMTQuMDltMjYuNjEsMjcuODdoMTYuODNWMzIuNDRsLTE3LDMuNjhWNTcuMDVhMjguMywyOC4zLDAsMCwwLTE0LjItMy42OGMtMTYuMTksMC0yOC45MiwxMi41MS0yOC45MiwyOC41YTI4LjI1LDI4LjI1LDAsMCwwLDI4LjQsMjguNiwyNS4xMiwyNS4xMiwwLDAsMCwxNC45My00LjgzWk0zMjAsNjdjNS4zNiwwLDkuODgsMy40NywxMS42Nyw4LjgzSDMwOC40N0MzMTAuMTUsNzAuMywzMTQuMzYsNjcsMzIwLDY3TTI5MS4zMyw4MmMwLDE2LjIsMTMuMjUsMjguODIsMzAuMjgsMjguODIsOS4zNiwwLDE2LjItMi41MywyMy4yNS04LjQybC0xMS4yNi0xMGMtMi42MywyLjc0LTYuNTIsNC4yMS0xMS4xNCw0LjIxYTE0LjM5LDE0LjM5LDAsMCwxLTEzLjY4LTguODNoMzkuNjVWODMuNTVjMC0xNy42Ny0xMS44OC0zMC4zOS0yOC4wOC0zMC4zOWEyOC41NywyOC41NywwLDAsMC0yOSwyOC44MU0yNjIsNTEuNThjNiwwLDkuMzYsMy43OCw5LjM2LDguMzFTMjY4LDY4LjIsMjYyLDY4LjJIMjQ0LjExVjUxLjU4Wm0tMzYsNTguMTZoMTguMDlWODIuOTJoMTMuNzdsMTMuODksMjYuODJIMjkybC0xNi4yLTI5LjQ1YTIyLjI3LDIyLjI3LDAsMCwwLDEzLjg4LTIwLjcyYzAtMTMuMjUtMTAuNDEtMjMuNDUtMjYtMjMuNDVIMjI2WiIvPjwvc3ZnPg==")',
    marginBottom: '20px',
    width: '250px',
  },
} as { [className: string]: React.CSSProperties };