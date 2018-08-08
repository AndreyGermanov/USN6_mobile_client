#!/bin/bash
mkdir -p android_icons/mipmap-hdpi
mkdir -p android_icons/mipmap-mdpi
mkdir -p android_icons/mipmap-xhdpi
mkdir -p android_icons/mipmap-xxhdpi
mkdir -p android_icons/mipmap-xxxhdpi
rsvg-convert -w 72 -h 72 -f png -o android_icons/mipmap-hdpi/ic_launcher.png $1
rsvg-convert -w 48 -h 48 -f png -o android_icons/mipmap-mdpi/ic_launcher.png $1
rsvg-convert -w 96 -h 96 -f png -o android_icons/mipmap-xhdpi/ic_launcher.png $1
rsvg-convert -w 144 -h 144 -f png -o android_icons/mipmap-xxhdpi/ic_launcher.png $1
rsvg-convert -w 192 -h 192 -f png -o android_icons/mipmap-xxxhdpi/ic_launcher.png $1

