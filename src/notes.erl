-module(notes).

-compile(export_all).

-include("records.hrl").


read_all(_S) ->
  Notes = stickydb:read_all(note),
  list:map(fun(F)-> {Struct, [{<<"id">>, F#note.id}]}, {<<"doc">>, F#note.doc} end, Notes).

create(S)->
  Doc = Struct:get_value(<<"doc">>, S),
  Id = stickydb:new_id(note),
  {atomic, ok} = stickydb:write({note, Id, Doc}),
  [struct:set_value(<<"Id">>, Id, S)].
