#!/bin/bash
gsutil mb gs://pong-client

gsutil iam ch allUsers:objectViewer gs://pong-client

gsutil web set -m index.html -e index.html gs://pong-client