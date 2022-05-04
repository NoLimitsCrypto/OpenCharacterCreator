import Button from "@mui/material/Button";
import React from "react";
import "./style.scss";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GavelIcon from "@mui/icons-material/Gavel";
import { useGlobalState } from "../GlobalProvider";
import loaderGif from "../../assets/media/loader.gif";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ConnectMint() {
  const { loading, navigation, mintavatar, setMintAvatar, setNavigation }: any =
    useGlobalState();
  let data: any = useGlobalState();
  const mint = () => {
    if (!mintavatar) {
      setNavigation("download");
      setMintAvatar(true);
    }
  };
  return (
    <div className="connect-mint-wrap">
      <Button variant="contained" startIcon={<AccountBalanceWalletIcon />}>
        Connect
      </Button>

      <Button
        onClick={() => mint()}
        variant="contained"
        startIcon={<GavelIcon />}
      >
        Mint
      </Button>
      {loading && (
        <div className="mint-loader">
          <div>
            <img src={loaderGif} />
          </div>
        </div>
      )}
    </div>
  );
}
