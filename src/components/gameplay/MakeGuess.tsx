import React, { useContext } from "react";
import { GameType, RoundPhase, TeamName } from "../../state/GameState";
import { Spectrum } from "../common/Spectrum";
import { CenteredColumn } from "../common/LayoutElements";
import { Button } from "../common/Button";
import { GameModelContext } from "../../state/GameModelContext";
import { RecordEvent } from "../../TrackEvent";
import { ScoreCoopRound } from "../../state/ScoreRound";

import { useTranslation } from "react-i18next";

export function MakeGuess() {
  const { t } = useTranslation();
  const { gameState, localPlayer, clueGiver, spectrumCard, setGameState } =
    useContext(GameModelContext);
  const [spectrumValue, setSpectrumValue] = React.useState(10);
  if (!clueGiver) {
    return null;
  }

  const notMyTurn =
    localPlayer.id === clueGiver.id ||
    (gameState.gameType === GameType.Teams &&
      localPlayer.team !== clueGiver.team);

  const guessingTeamString = TeamName(clueGiver.team, t);

  if (notMyTurn) {
    return (
      <div>
        <Spectrum spectrumCard={spectrumCard} guessingValue={gameState.guess} />
        <CenteredColumn>
          <div>
            {t("makeguess.players_clue", { givername: clueGiver.name })}:{" "}
            <strong>{gameState.clue}</strong>
          </div>
          <div>Waiting for all the players to guess...</div>
          {Object.keys(gameState.players).length < 2 && (
            <div
              style={{
                margin: 12,
                padding: "0 1em",
                border: "1px solid black",
              }}
            >
              <p>{t("makeguess.invite_other_players")}</p>
              <p>
                {t("makeguess.share_game_url", {
                  game_url: window.location.href,
                })}
              </p>
            </div>
          )}
        </CenteredColumn>
      </div>
    );
  }

  const onClickHandler = () => {
    RecordEvent("guess_submitted", {
      spectrum_card: spectrumCard.join("|"),
      clue: gameState.clue,
      target: gameState.spectrumTarget.toString(),
      guess: gameState.guess.toString(),
    });
    if (gameState.gameType === GameType.Teams) {
      setGameState({
        roundPhase: RoundPhase.CounterGuess,
      });
    } else if (gameState.gameType === GameType.Cooperative) {
      setGameState(ScoreCoopRound(gameState));
    } else {
      const newPlayersObj = {
        ...gameState.players[localPlayer.id],
        guess: spectrumValue,
      };
      const isAllDoneGuessing = Object.keys(gameState.players).every((key) => {
        return (
          gameState.players[key].guess != undefined ||
          gameState.players[key].name === clueGiver.name ||
          localPlayer.name === gameState.players[key].name
        );
      });
      if (isAllDoneGuessing) {
        setGameState({
          roundPhase: RoundPhase.ViewScore,
          players: {
            ...gameState.players,
            [localPlayer.id]: newPlayersObj,
          },
        });
      } else {
        setGameState({
          // roundPhase: RoundPhase.ViewScore,
          players: {
            ...gameState.players,
            [localPlayer.id]: newPlayersObj,
          },
        });
      }
    }
  };
  const guessSubmitted = gameState.players[localPlayer.id].guess != undefined;

  const onChangeHandler = (guess: number) => {
    !guessSubmitted && setSpectrumValue(guess);
  };
  return (
    <div>
      <Spectrum
        spectrumCard={spectrumCard}
        handleValue={spectrumValue}
        // onChange={(guess: number) => {
        //   setGameState({
        //     guess,
        //   });
        onChange={onChangeHandler}
      />
      <CenteredColumn>
        <div>
          {t("makeguess.players_clue", { givername: clueGiver.name })}:{" "}
          <strong>{gameState.clue}</strong>
        </div>
        <div>
          {guessSubmitted && <div>guess submitted </div>}
          {!guessSubmitted && (
            <Button text={t("makeguess.guess", {})} onClick={onClickHandler} />
          )}
        </div>
      </CenteredColumn>
    </div>
  );
}
