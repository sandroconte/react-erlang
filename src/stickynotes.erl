%% @author Mochi Media <dev@mochimedia.com>
%% @copyright 2010 Mochi Media <dev@mochimedia.com>

%% @doc stickynotes.

-module(stickynotes).
-author("Mochi Media <dev@mochimedia.com>").
-export([start/0, stop/0]).

ensure_started(App) ->
    case application:start(App) of
        ok ->
            ok;
        {error, {already_started, App}} ->
            ok
    end.


%% @spec start() -> ok
%% @doc Start the stickynotes server.
start() ->
    stickynotes_deps:ensure(),
    ensure_started(crypto),
    ensure_started(mnesia),
    application:start(stickynotes).


%% @spec stop() -> ok
%% @doc Stop the stickynotes server.
stop() ->
    application:stop(stickynotes), 
    application:stop(mnesia).
