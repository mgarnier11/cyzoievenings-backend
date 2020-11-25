#!/bin/sh
git remote add cleverapps
https://$CLEVER_TOKEN:$CLEVER_SECRET@push.clever-cloud.com/app_YOUR_APPLICATION_ID.git
git --verbose --force push cleverapps master
