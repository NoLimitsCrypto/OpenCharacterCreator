import { Button } from "@mui/material";
import * as React from "react";
// import { useWeb3React } from "@web3-react/core";
// import { InjectedConnector } from "@web3-react/injected-connector";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { threeService } from "../../services";
import { useGlobalState } from "../GlobalProvider";
import "./style.scss";
// import Moralis from "moralis";
import { contractABI, contractAddress } from "../../library/contract";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import * as THREE from "three";
import { apiService } from "../../services/api";
export function DownloadTools() {
  const {
    scene,
    model,
    templateInfo,
    gl,
    camera,
    mintavatar,
    setMintAvatar,
  }: any = useGlobalState();
  const [file, setFile] = React.useState(null);
  // const [imagefile, setImageFile] = React.useState(null);
  const [name, setName] = React.useState("test");
  const [description, setDescription] = React.useState("test");
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);
  const downloadModel = (format: any) => {
    threeService.download(
      model,
      `CC_Model_${templateInfo.name.replace(" ", "_")}`,
      format,
      false
    );
  };

  React.useEffect(() => {
    if (file && preview) {
      mint();
    }
  }, [file, preview]);

  React.useEffect(() => {
    if (mintavatar) {
      generateMintFile();
    }
  }, [mintavatar]);

  const mint = async () => {
    try {
      const formData = new FormData();
      formData.append("profile", preview);
      setLoading(true);
      const fileurl = await apiService.saveFileToPinata(formData);
      setLoading(false);
      alert(`upploaded to pinata, IpfsHash = ${fileurl.IpfsHash}`);
      console.log("UPLOADED TO PINATA, Upload Result", fileurl);
      /*
      // previewimage and metadata 
      const imageformData = new FormData();
      imageformData.append('profile',preview)
      const imageurl = apiService.saveFileToPinata(imageformData)
      setMintAvatar(false)

      const metadata = {
        name : "test",
        description : "test",
        image: imageurl,
        animation_url: fileurl,
      };
      const metadatafile = new File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      const metadataformData = new FormData();
      metadataformData.append('profile',preview)
      const metadataurl = apiService.saveMetaDataToPinata(metadataformData)

      /////////////////////////// web3 //////////////////////////////
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const transaction = await tokenContract.mint(metadataurl);
      const tx = await transaction.wait();
      const event = tx.events[0];
      const value = event.args.tokenId;
      const tokenId = value.toNumber();
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      );
      */
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
  };
  /*
  const onMetamaskSignClicked = async () => {
    const message = ethers.utils.solidityKeccak256(
      ["address", "address"],
      [contractAddress, account]
    );
    const arrayifyMessage = ethers.utils.arrayify(message);
    const flatSignature = await library
      .getSigner()
      .signMessage(arrayifyMessage);
    const response = await axios.post(`${API_URL}/new-request`, {
      signature: flatSignature,
      address: account,
    });
    alert(response.data.msg);
    // setErrorBlock(response.data.msg);
  };
*/
  const generateMintFile = async () => {
    function save(blob, filename) {
      const fileOfBlob = new File([blob], filename);
      setFile(fileOfBlob);
    }

    function saveString(text, filename) {
      save(new Blob([text], { type: "text/plain" }), filename);
    }

    function saveArrayBuffer(buffer, filename) {
      save(new Blob([buffer], { type: "application/octet-stream" }), filename);
    }

    const downloadFileName = `CC_Model_${templateInfo.name.replace(" ", "_")}`;
    setName(downloadFileName);
    setDescription(`${downloadFileName} Description.`);
    const exporter = new GLTFExporter();
    const options = {
      trs: false,
      onlyVisible: false,
      truncateDrawRange: true,
      binary: true,
      forcePowerOfTwoTextures: false,
      maxTextureSize: 1024 || Infinity,
    };
    exporter.parse(
      model.scene,
      function (result) {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, `${downloadFileName}.glb`);
        } else {
          const output = JSON.stringify(result, null, 2);
          saveString(output, `${downloadFileName}.gltf`);
        }
      },
      options
    );
    renderToPNG();
  };

  const renderToPNG = () => {
    const downloadFileName = `CC_Model_${templateInfo.name.replace(" ", "_")}`;
    gl.domElement.getContext("webgl", { preserveDrawingBuffer: true });
    const hemisphereLight = new THREE.HemisphereLight(0xf6e86d, 0x404040, 1);
    scene.add(hemisphereLight);
    camera.position.set(0, 1.8, 0.5);
    gl.render(scene, camera);
    gl.domElement.toBlob(function (blob) {
      const fileOfBlob = new File([blob], `${downloadFileName}.png`);
      console.log("imagefile", fileOfBlob);
      setPreview(fileOfBlob);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
        camera.position.set(0, 1.5, 5);
        scene.remove(hemisphereLight);
      });
      reader.readAsDataURL(fileOfBlob);
    });

    gl.domElement.getContext("webgl", { preserveDrawingBuffer: false });
  };

  return (
    <div>
      <img id="previewimage" src={previewImage} />
      <Button
        onClick={() => downloadModel("gltf/glb")}
        variant="outlined"
        className="download-button"
      >
        Download GLTF/GLB
      </Button>
      <Button
        onClick={() => downloadModel("obj")}
        variant="outlined"
        className="download-button"
      >
        Download OBJ
      </Button>
      <Button
        onClick={() => downloadModel("vrm")}
        variant="outlined"
        className="download-button"
      >
        Download VRM
      </Button>
      <div className="minting-loader">
        {loading && <div>minting.....Please wait</div>}
      </div>
    </div>
  );
}
