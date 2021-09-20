#!/bin/sh
ip=$(ip route get 1.2.3.4 | awk '{print $7}')

echo Starting proxy from ip "$ip"

adb root
adb shell "settings put global http_proxy $ip:8085"
mitmdump -s proxy.py -p 8085
adb shell "settings put global http_proxy :0"
