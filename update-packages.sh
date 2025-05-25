#!/bin/bash

# Script to update package declarations in Java files

BASEDIR="backend/src/main/java/com/jaysambhu/modulynx"

# Find all Java files and update package declarations
find "$BASEDIR" -name "*.java" -type f -exec sed -i 's/package com.jaysambhu.dairymanagementsystem/package com.jaysambhu.modulynx/g' {} \;

# Update imports as well
find "$BASEDIR" -name "*.java" -type f -exec sed -i 's/import com.jaysambhu.dairymanagementsystem/import com.jaysambhu.modulynx/g' {} \;

# For core modules, update any references to modules
find "$BASEDIR/core" -name "*.java" -type f -exec sed -i 's/modulynx.modules.user/modulynx.core.user/g' {} \;
find "$BASEDIR/core" -name "*.java" -type f -exec sed -i 's/modulynx.modules.auth/modulynx.core.auth/g' {} \;
find "$BASEDIR/core" -name "*.java" -type f -exec sed -i 's/modulynx.modules.tenant/modulynx.core.tenant/g' {} \;
find "$BASEDIR/core" -name "*.java" -type f -exec sed -i 's/modulynx.modules.company/modulynx.core.company/g' {} \;

echo "Package declarations updated" 