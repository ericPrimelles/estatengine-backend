#!/bin/bash

set -e
rm -rf dist
mkdir -p dist

function package_lambda() {
    LAMBDA_NAME=$1

    cd $LAMBDA_NAME
    rm -rf package
    mkdir package

    if [ -f requirements.txt ]; then
        pip install -r requirements.txt -t package
    fi

    cd package
    zip -r ../${LAMBDA_NAME}.zip .
    cd ..

    zip -g ${LAMBDA_NAME}.zip ${LAMBDA_NAME}.py
    mv ${LAMBDA_NAME}.zip ../dist/
    rm -rf package
    cd ..

    echo "Packaged $LAMBDA_NAME"
    
}

package_lambda openai_proxy
package_lambda search_engine