const updatePlayPauseActions = (player) => {
  contexts.playPauseAction.forEach((context) => {
    player.playbackState &&
      websocketUtils.setState(context, PlaybackState[player.playbackState]);
  });
};

const updateToggleMuteActions = (player) => {
  contexts.toggleMuteAction.forEach((context) => {
    player.volume &&
      websocketUtils.setState(
        context,
        player.volume.isMuted ? MuteState.muted : MuteState.unmuted
      );
  });
};

const updateCurrentVolumeActions = (player) => {
  contexts.currentVolumeAction.forEach((context) => {
    player.volume &&
      websocketUtils.setTitle(
        context,
        `${Math.ceil(100 + player.volume.value)}`
      );
  });
};

const parameters = {
  player: "true",
  trcolumns: "%artist%-%title%,%artist%-%album%-%title%",
  playlists: "true",
  playlistItems: "true",
  plref: "p1",
  plcolumns: "%artist%,%title%",
  plrange: "0:100",
};

const eventSource = new EventSource(
  `${foobar.baseUrl}/query/updates?${new URLSearchParams(
    parameters
  ).toString()}`
);

eventSource.onmessage = function ({ data }) {
  const { player } = JSON.parse(data);
  if (player) {
    foobarPlayerState = player;
    updatePlayPauseActions(player);
    updateToggleMuteActions(player);
    updateCurrentVolumeActions(player);
  }
};

eventSource.onerror = (error) => {
  websocketUtils.log(
    "Error to connect with foobar2000, check if foobar is running!"
  );
};
