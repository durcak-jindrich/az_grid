#!/bin/bash
ip_info=$(ipconfig | grep "IPv4 Address")
IFS=':'; ip_adresses=($ip_info); unset IFS;
target_port=8000
echo "AZ kviz running on local network${ip_adresses[-1]}:$target_port"
~/Anaconda3/envs/infor/python -m http.server $target_port
