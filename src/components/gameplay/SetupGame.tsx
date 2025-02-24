import React from "react";
import { GameType, RoundPhase } from "../../state/GameState";
import { CenteredRow, CenteredColumn } from "../common/LayoutElements";
import { Button } from "../common/Button";
import { LongwaveAppTitle } from "../common/Title";
import { useContext } from "react";
import { GameModelContext } from "../../state/GameModelContext";
import { NewRound } from "../../state/NewRound";

import { useTranslation } from "react-i18next";

export function SetupGame() {
  const { t } = useTranslation();
  const cardsTranslation = useTranslation("spectrum-cards");
  const { gameState, setGameState, localPlayer } = useContext(GameModelContext);

  const startGame = (gameType: GameType) => {
    if (gameType === GameType.Teams) {
      setGameState({
        roundPhase: RoundPhase.PickTeams,
        gameType,
      });
    } else {
      setGameState({
        ...NewRound(localPlayer.id, gameState, cardsTranslation.t),
        gameType,
      });
    }
  };

  return (
    <CenteredColumn>
      <LongwaveAppTitle />
      <CenteredRow style={{ flexWrap: "wrap" }}>
        <Button
          text={t("setupgame.free_game")}
          onClick={() => startGame(GameType.Freeplay)}
        />
      </CenteredRow>
    </CenteredColumn>
  );
}
