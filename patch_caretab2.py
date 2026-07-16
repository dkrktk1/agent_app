import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For Left Bar
content = content.replace(
    '<text x={x + width / 2} y={y - 22} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">\n                          좌\n                        </text>',
    '<text x={x + width / 2 - 2} y={y - 18} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">\n                          좌\n                        </text>'
)

content = content.replace(
    '<text x={x + width / 2} y={y - 8} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">\n                          {value}\n                        </text>\n                      </g>\n                    );\n                  }}\n                />\n              </Bar>\n              <Bar dataKey="right"',
    '<text x={x + width / 2 - 2} y={y - 6} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">\n                          {value}\n                        </text>\n                      </g>\n                    );\n                  }}\n                />\n              </Bar>\n              <Bar dataKey="right"'
)

# For Right Bar
content = content.replace(
    '<text x={x + width / 2} y={y - 22} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">\n                          우\n                        </text>',
    '<text x={x + width / 2 + 2} y={y - 18} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">\n                          우\n                        </text>'
)

content = content.replace(
    '<text x={x + width / 2} y={y - 8} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">\n                          {value}\n                        </text>\n                      </g>\n                    );\n                  }}\n                />\n              </Bar>\n            </BarChart>',
    '<text x={x + width / 2 + 2} y={y - 6} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">\n                          {value}\n                        </text>\n                      </g>\n                    );\n                  }}\n                />\n              </Bar>\n            </BarChart>'
)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
