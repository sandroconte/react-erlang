%% @author Mochi Media <dev@mochimedia.com>
%% @copyright stickynotes Mochi Media <dev@mochimedia.com>

%% @doc Callbacks for the stickynotes application.

-module(stickynotes_app).
-author("Mochi Media <dev@mochimedia.com>").

-behaviour(application).
-export([start/2,stop/1]).


%% @spec start(_Type, _StartArgs) -> ServerRet
%% @doc application start callback for stickynotes.
start(_Type, _StartArgs) ->
    stickynotes_deps:ensure(),
    stickynotes_sup:start_link().

%% @spec stop(_State) -> ServerRet
%% @doc application stop callback for stickynotes.
stop(_State) ->
    ok.
