export AWS_DEFAULT_REGION=us-west-2
if [[ "$CIRCLE_BRANCH" == "production" ]]; then
  export AWS_BUCKET=seekingalpha-public-production
  assumed_role_json="$(aws --output json \
      sts assume-role \
      --role-arn $PRODUCTION_ROLE \
      --role-session-name rocketchat-deploy
  )"
  assumed_role_variables="$(echo "${assumed_role_json}" | jq -r '
  "export AWS_SESSION_TOKEN=" + .Credentials.SessionToken + "\n" +
  "export AWS_ACCESS_KEY_ID=" + .Credentials.AccessKeyId + "\n" +
  "export AWS_SECRET_ACCESS_KEY=" + .Credentials.SecretAccessKey + "\n"
  ')"
  eval "${assumed_role_variables}"
else
  export AWS_BUCKET=seekingalpha-public-staging
fi

if [[ "$CIRCLE_BRANCH" == "production" || "$CIRCLE_BRANCH" == "staging" ]]; then
  export UPLOAD_DIR="rocket-chat"
else
  export UPLOAD_DIR="rocket-chat-update"
fi
