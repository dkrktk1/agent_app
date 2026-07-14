#!/bin/bash
sed -i 's/let newUser: any = { userId, password, role };/let newUser: any = { userId, password, role, createdAt: new Date().toISOString() };/' src/components/AuthScreen.tsx
