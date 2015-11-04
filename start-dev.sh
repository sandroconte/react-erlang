#!/bin/sh
exec erl \
    -pa ebin deps/*/ebin \
    -boot start_sasl \
    -sname stickynotes_dev \
    -s stickynotes \
    -s reloader \
    -mnesia '"db"'
