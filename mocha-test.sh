#!/bin/bash

# run: npm test or npm test TEST_NAME

if [ -z $1 ]; then set $1 '.'; fi

NODE_ENV=test \
HOST=0.0.0.0 \
PORT=88 \
SERVICES=mailgun,mailjet \
MAILGUN_API=mock_api \
MAILGUN_DOMAIN=mock_domain \
MAILJET_API=user:pass \
nyc mocha --exit --grep $1