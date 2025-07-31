#!/bin/bash
cd /home/kavia/workspace/code-generation/responsive-navigation-bar-with-user-profile-92842-92851/responsive_navbar_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

