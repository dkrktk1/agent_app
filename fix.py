def fix_file(filepath):
    with open(filepath, 'r') as f:
        text = f.read()

    target = """                          ))}
                        </div>
                      </div>
                    </div>
                ))}"""
    
    replace = """                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}"""
                
    if target in text:
        text = text.replace(target, replace)
        print(f"Fixed {filepath}")
    else:
        print(f"Not found in {filepath}")
        
    with open(filepath, 'w') as f:
        f.write(text)

fix_file('src/components/CareTab.tsx')
fix_file('src/components/ScheduleTab.tsx')
