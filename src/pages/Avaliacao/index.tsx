import { ChangeEvent, useEffect, useState } from "react";
import { SectionDisposicaoProdutos } from "./components/sectionDisposicaoProdutos";
import { SectionEmbalagens } from "./components/sectionEmbalagens";
import { SectionLimpeza } from "./components/sectionLimpeza";
import { SectionOrganizacao } from "./components/sectionOrganizacao";
import { SectionPrecificacao } from "./components/sectionPrecificacao";
import { SectionValidadeProdutos } from "./components/sectionValidadeProdutos";
import { formatDate } from "../../utils/formatDate";
import style from "./index.module.css";
import { ciAxios } from "../../utils/ciAxios";
import { toastClear, toastError, toastPromise } from "../../utils/toast";

interface IResponse {
  codavali: number;
}

interface Avaliacao {
  resposavel: string;
  date: string;
  numeroResponsavel: string;
  starsLimpeza: number;
  observacaoLimpeza: string;
  imagesLimpezaSrc: string[];
  videosLimpezaSrc: string[];
  starsOrganizacao: number;
  observacaoOrganizacao: string;
  imagesOrganizacaoSrc: string[];
  videosOrganizacaoSrc: string[];
  starsDisposicaoProdutos: number;
  observacaoDisposicaoProdutos: string;
  imagesDisposicaoProdutosSrc: string[];
  videosDisposicaoProdutosSrc: string[];
  starsPrecificacao: number;
  observacaoPrecificacao: string;
  imagesPrecificacaoSrc: string[];
  videosPrecificacaoSrc: string[];
  starsValidade: number;
  observacaoValidadeProdutos: string;
  imagesValidadeProdutosSrc: string[];
  videosValidadeProdutosSrc: string[];
  starsEmbalagens: number;
  observacaoEmbalagens: string;
  imagesEmbalagensSrc: string[];
  videosEmbalagensSrc: string[];
}

export function Avaliacao() {
  const [setorAvaliado, setSetorAvaliado] = useState("Tintas");
  const [responsavel, setResponsavel] = useState("Teste-5512992269582");
  const [avaliador, setAvaliador] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  const [observacaoLimpeza, setObservacaoLimpeza] = useState("");
  const [starsLimpeza, setStarsLimpeza] = useState(0);
  const [imagesLimpezaSrc, setImagesLimpezaSrc] = useState<string[]>([]);
  const [videosLimpezaSrc, setVideosLimpezaSrc] = useState<string[]>([]);

  const [observacaoOrganizacao, setObservacaoOrganizacao] = useState("");
  const [starsOrganizacao, setStarsOrganizacao] = useState(0);
  const [imagesOrganizacaoSrc, setImagesOrganizacaoSrc] = useState<string[]>(
    []
  );
  const [videosOrganizacaoSrc, setVideosOrganizacaoSrc] = useState<string[]>(
    []
  );

  const [observacaoDisposicaoProdutos, setObservacaoDisposicaoProdutos] =
    useState("");
  const [starsDisposicaoProdutos, setStarsDisposicaoProdutos] = useState(0);
  const [imagesDisposicaoProdutosSrc, setImagesDisposicaoProdutosSrc] =
    useState<string[]>([]);
  const [videosDisposicaoProdutosSrc, setVideosDisposicaoProdutosSrc] =
    useState<string[]>([]);

  const [precificacaoProdutoOneCode, setPrecificacaoProdutoOneCode] =
    useState("");

  const [
    precificacaoProdutoOneValorSistema,
    setPrecificacaoProdutoOneValorSistema,
  ] = useState("");
  const [
    precificacaoProdutoOneValorPrateleira,
    setPrecificacaoProdutoOneValorPrateleira,
  ] = useState("");
  const [precificacaoProdutoTwoCode, setPrecificacaoProdutoTwoCode] =
    useState("");

  const [
    precificacaoProdutoTwoValorSistema,
    setPrecificacaoProdutoTwoValorSistema,
  ] = useState("");
  const [
    precificacaoProdutoTwoValorPrateleira,
    setPrecificacaoProdutoTwoValorPrateleira,
  ] = useState("");
  const [observacaoPrecificacao, setObservacaoPrecificacao] = useState("");
  const [starsPrecificacao, setStarsPrecificacao] = useState(0);
  const [imagesPrecificacaoSrc, setImagesPrecificacaoSrc] = useState<string[]>(
    []
  );
  const [videosPrecificacaoSrc, setVideosPrecificacaoSrc] = useState<string[]>(
    []
  );

  const [validadeProdutosOne, setValidadeProdutosOne] = useState("");
  const [validadeProdutosOneDate, setValidadeProdutosOneDate] = useState("");
  const [validadeProdutosTwo, setValidadeProdutosTwo] = useState("");
  const [validadeProdutosTwoDate, setValidadeProdutosTwoDate] = useState("");
  const [observacaoValidadeProdutos, setObservacaoValidadeProdutos] =
    useState("");
  const [starsValidade, setStarsValidade] = useState(0);
  const [imagesValidadeProdutosSrc, setImagesValidadeProdutosSrc] = useState<
    string[]
  >([]);
  const [videosValidadeProdutosSrc, setVideosValidadeProdutosSrc] = useState<
    string[]
  >([]);

  const [observacaoEmbalagens, setObservacaoEmbalagens] = useState("");
  const [starsEmbalagens, setStarsEmbalagens] = useState(0);
  const [imagesEmbalagensSrc, setImagesEmbalagensSrc] = useState<string[]>([]);
  const [videosEmbalagensSrc, setVideosEmbalagensSrc] = useState<string[]>([]);

  const onSetorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSetorAvaliado(event.target.value);
  };

  const onAvaliadorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAvaliador(event.target.value);
  };

  const onResponsavelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setResponsavel(event.target.value);
  };

  const clearData = () => {
    setAvaliador("");
    setObservacaoDisposicaoProdutos("");
    setObservacaoEmbalagens("");
    setObservacaoLimpeza("");
    setObservacaoOrganizacao("");
    setObservacaoPrecificacao("");
    setObservacaoValidadeProdutos("");
    setPrecificacaoProdutoOneCode("");
    setPrecificacaoProdutoOneValorPrateleira("");
    setPrecificacaoProdutoOneValorSistema("");
    setPrecificacaoProdutoTwoCode("");
    setPrecificacaoProdutoTwoValorPrateleira("");
    setPrecificacaoProdutoTwoValorSistema("");
    setValidadeProdutosOne("");
    setValidadeProdutosOneDate("");
    setValidadeProdutosTwo("");
    setValidadeProdutosTwoDate("");
    setResponsavel("");
    setSetorAvaliado("");
    setStarsDisposicaoProdutos(0);
    setStarsEmbalagens(0);
    setStarsLimpeza(0);
    setStarsOrganizacao(0);
    setStarsPrecificacao(0);
    setStarsValidade(0);
    setImagesDisposicaoProdutosSrc([]);
    setImagesEmbalagensSrc([]);
    setImagesLimpezaSrc([]);
    setImagesOrganizacaoSrc([]);
    setImagesPrecificacaoSrc([]);
    setImagesValidadeProdutosSrc([]);
    setVideosDisposicaoProdutosSrc([]);
    setVideosEmbalagensSrc([]);
    setVideosLimpezaSrc([]);
    setVideosOrganizacaoSrc([]);
    setVideosPrecificacaoSrc([]);
    setVideosValidadeProdutosSrc([]);
  };

  const sendFiles = async (
    array: string[],
    codavali: number,
    setor: string,
    tipoArquivo: string
  ) => {
    array.forEach(async (urlFile, index) => {
      const formData = new FormData();
      const blobFile = await (await fetch(urlFile)).blob();

      let nomeArquivo = "";
      let file: File = new File([""], "");

      if (tipoArquivo === "foto") {
        nomeArquivo = `${codavali}_foto_${setor}_${index}.jpg`;
        file = new File([blobFile], nomeArquivo, { type: "image/jpg" });
      } else {
        nomeArquivo = `${codavali}_video_${setor}_${index}.mp4`;
        file = new File([blobFile], nomeArquivo, { type: "video/mp4" });
      }

      formData.append("file", file);

      await ciAxios.post(
        `${import.meta.env.VITE_SERVER_NODE_URL}/uploads/avaliacao`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });
  };

  const sendAvaliacaoBackup = async (avaliacao: Avaliacao) => {
    try {
      await ciAxios.get(`${import.meta.env.VITE_SERVER_NODE_URL}/health`);
      await ciAxios.post(
        `${import.meta.env.VITE_SERVER_NODE_URL}/send-message`,
        {
          number: avaliacao.numeroResponsavel,
          message: `Ola *${avaliacao.resposavel.trim()}* o avaliador *${avaliador.trim()}* acabou de fazer uma avaliação sua confira a seguir sua avaliação.`,
        }
      );

      await toastPromise({
        asyncFunction: ciAxios.post(
          `${import.meta.env.VITE_SERVER_NODE_URL}/avaliacao`,
          {
            avaliacao,
          }
        ),
        pendingMessage: "Processando",
        onSucess: {
          render() {
            const temp = avaliacoes.filter(
              (tempAvaliacao) =>
                JSON.stringify(tempAvaliacao) !== JSON.stringify(avaliacao)
            );
            setAvaliacoes([...temp]);
            return "Dados salvos com sucesso, logo sera enviado a avaliação";
          },
        },
        onError: {
          render() {
            setTimeout(() => {
              sendAvaliacaoBackup(avaliacao);
            }, 3000);
            return "Erro ao tentar enviar avaliação, nova tentativa em 3 segundos";
          },
        },
      });
    } catch (error) {
      toastError({ message: `Erro ao tentar comunicar com servidor ${error}` });
    }
  };

  const submitForm = async () => {
    try {
      await ciAxios.get(`${import.meta.env.VITE_SERVER_NODE_URL}/health`);
      const pathBase = "\\\\192.168.100.99\\sistema\\Avaliacao";
      const precoPrateleiraOne = precificacaoProdutoOneValorPrateleira
        .replace(",", ".")
        .replace("R$", "")
        .trim();

      const precoSistemaOne = precificacaoProdutoOneValorSistema
        .replace(",", ".")
        .replace("R$", "")
        .trim();
      const precoPrateleiraTwo = precificacaoProdutoTwoValorPrateleira
        .replace(",", ".")
        .replace("R$", "")
        .trim();
      const precoSistemaTwo = precificacaoProdutoTwoValorSistema
        .replace(",", ".")
        .replace("R$", "")
        .trim();

      const status_preco =
        Number(precoPrateleiraOne) !== Number(precoSistemaOne) ||
        Number(precoPrateleiraTwo) !== Number(precoSistemaTwo)
          ? "Valores diferentes"
          : "Valores iguais";
      let error = "";

      if (!avaliador) {
        error = "Avaliador não preenchido";
      } else if (!responsavel) {
        error = "Responsavel não preenchido";
      } else if (!setorAvaliado) {
        error = "Setor avaliado não preenchido";
      } else if (!starsLimpeza) {
        error = "Pontuação na sessão de limpeza não preenchido";
      } else if (!starsOrganizacao) {
        error = "Pontuação na sessão de Organização não preenchido";
      } else if (!starsDisposicaoProdutos) {
        error = "Pontuação na sessão de Disposição de produtos não preenchido";
      } else if (!starsPrecificacao) {
        error = "Pontuação na sessão de Precificação não preenchido";
      } else if (!precificacaoProdutoOneCode) {
        error = "Primeiro produto não preenchido na sessão de Precificação";
      } else if (!precificacaoProdutoOneValorPrateleira) {
        error = "Precificação da prateleira do primeiro produto não preenchido";
      } else if (!precificacaoProdutoTwoCode) {
        error = "Segundo produto não preenchido na sessão de Precificação";
      } else if (!precificacaoProdutoTwoValorPrateleira) {
        error = "Precificação da prateleira do segundo produto não preenchido";
      } else if (!starsEmbalagens) {
        error = "Pontuação na sessão de Embalagens não preenchido";
      }

      if (!error) {
        const data = {
          tipo: 1,
          avaliador: avaliador.trim(),
          setor: setorAvaliado,
          responsavel: responsavel.trim().split("-")[0],
          nota_limp: starsLimpeza,
          nota_org: starsOrganizacao,
          nota_prod: starsDisposicaoProdutos,
          nota_preco: starsPrecificacao,
          codpro1: precificacaoProdutoOneCode,
          valor1: precificacaoProdutoOneValorPrateleira,
          codpro2: precificacaoProdutoTwoCode,
          valor2: precificacaoProdutoTwoValorPrateleira,
          nota_val: starsValidade,
          codpro3: validadeProdutosOne,
          val3: validadeProdutosOneDate,
          codpro4: validadeProdutosTwo,
          val4: validadeProdutosTwoDate,
          nota_emb: starsEmbalagens,
          obs_lim: observacaoLimpeza.trim(),
          obs_org: observacaoOrganizacao.trim(),
          obs_prod: observacaoDisposicaoProdutos.trim(),
          obs_preco: observacaoPrecificacao.trim(),
          obs_val: observacaoValidadeProdutos.trim(),
          obs_emb: observacaoEmbalagens.trim(),
          status_preco,
        };

        const {
          data: { codavali },
        } = await toastPromise({
          asyncFunction: ciAxios.post<IResponse>(
            `${import.meta.env.VITE_SERVER_NODE_URL}/avaliacao/inserir`,
            {
              ...data,
            }
          ),

          pendingMessage: "Enviando avaliação para tabela",
          onError: "Erro ao tentar enviar avaliação para tabela",
        });

        const [nomeResponsavel, numeroResponsavel] = responsavel.split("-");

        sendFiles(imagesLimpezaSrc, codavali, "limpeza", "foto");
        sendFiles(videosLimpezaSrc, codavali, "limpeza", "video");
        sendFiles(imagesDisposicaoProdutosSrc, codavali, "disposicao", "foto");
        sendFiles(videosDisposicaoProdutosSrc, codavali, "disposicao", "video");
        sendFiles(imagesEmbalagensSrc, codavali, "embalagens", "foto");
        sendFiles(videosEmbalagensSrc, codavali, "embalagens", "video");
        sendFiles(imagesOrganizacaoSrc, codavali, "organizacao", "foto");
        sendFiles(videosOrganizacaoSrc, codavali, "organizacao", "video");
        sendFiles(imagesPrecificacaoSrc, codavali, "precificacao", "foto");
        sendFiles(videosPrecificacaoSrc, codavali, "precificacao", "video");
        sendFiles(imagesValidadeProdutosSrc, codavali, "validade", "foto");
        sendFiles(videosValidadeProdutosSrc, codavali, "validade", "video");

        await ciAxios.post(
          `${import.meta.env.VITE_SERVER_NODE_URL}/send-message`,
          {
            number: numeroResponsavel,
            message: `Ola *${nomeResponsavel.trim()}* o avaliador *${avaliador.trim()}* acabou de fazer uma avaliação sua confira a seguir sua avaliação no setor *${setorAvaliado}*.`,
          }
        );

        const avaliacao: Avaliacao = {
          resposavel: data.responsavel,
          date:
            formatDate(new Date()) + " - " + new Date().toLocaleTimeString(),
          numeroResponsavel,
          starsLimpeza,
          observacaoLimpeza,
          imagesLimpezaSrc: imagesLimpezaSrc.map(
            (_, index) => `${pathBase}\\${codavali}_foto_limpeza_${index}.jpg`
          ),
          videosLimpezaSrc: videosLimpezaSrc.map(
            (_, index) => `${pathBase}\\${codavali}_video_limpeza_${index}.mp4`
          ),
          starsOrganizacao,
          observacaoOrganizacao,
          imagesOrganizacaoSrc: imagesOrganizacaoSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_foto_organizacao_${index}.jpg`
          ),
          videosOrganizacaoSrc: videosOrganizacaoSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_video_organizacao_${index}.mp4`
          ),
          starsDisposicaoProdutos,
          observacaoDisposicaoProdutos,
          imagesDisposicaoProdutosSrc: imagesDisposicaoProdutosSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_foto_disposicao_${index}.jpg`
          ),
          videosDisposicaoProdutosSrc: videosDisposicaoProdutosSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_video_disposicao_${index}.mp4`
          ),
          starsPrecificacao,
          observacaoPrecificacao,
          imagesPrecificacaoSrc: imagesPrecificacaoSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_foto_precificacao_${index}.jpg`
          ),
          videosPrecificacaoSrc: videosPrecificacaoSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_video_precificacao_${index}.mp4`
          ),
          starsValidade,
          observacaoValidadeProdutos,
          imagesValidadeProdutosSrc: imagesValidadeProdutosSrc.map(
            (_, index) => `${pathBase}\\${codavali}_foto_validade_${index}.jpg`
          ),
          videosValidadeProdutosSrc: videosValidadeProdutosSrc.map(
            (_, index) => `${pathBase}\\${codavali}_video_validade_${index}.mp4`
          ),
          starsEmbalagens,
          observacaoEmbalagens,
          imagesEmbalagensSrc: imagesEmbalagensSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_foto_embalagens_${index}.jpg`
          ),
          videosEmbalagensSrc: videosEmbalagensSrc.map(
            (_, index) =>
              `${pathBase}\\${codavali}_video_embalagens_${index}.mp4`
          ),
        };

        toastClear();

        const sendAvaliacao = async () => {
          await toastPromise({
            asyncFunction: ciAxios.post(
              `${import.meta.env.VITE_SERVER_NODE_URL}/avaliacao`,
              {
                avaliacao,
              }
            ),

            pendingMessage: "Processando",
            onSucess: {
              render() {
                clearData();
                return "Dados salvos com sucesso, logo sera enviado a avaliação";
              },
            },
            onError: {
              render() {
                setTimeout(() => {
                  sendAvaliacao();
                }, 3000);
                return "Erro ao tentar enviar avaliação, nova tentativa em 3 segundos";
              },
            },
          });
        };
        sendAvaliacao();
        setAvaliacoes([avaliacao, ...avaliacoes]);
      } else {
        toastError({ message: error });
      }
    } catch (error) {
      toastError({ message: `Erro ao tentar comunicar com servidor ${error}` });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className={style.avaliacaoContainer}>
      <h2>Avaliação</h2>
      <div className={style.avaliacaoOptions}>
        <select onChange={onSetorChange} value={setorAvaliado}>
          <option value="Tintas">Tintas</option>
          <option value="Conexoes">Conexões</option>
          <option value="Sifao">Sifão</option>
          <option value="Ferramentas">Ferramentas</option>
          <option value="Produtos limpeza">Produtos limpeza</option>
          <option value="Ferragens">Ferragens</option>
          <option value="Torneiras">Torneiras</option>
          <option value="UD">UD</option>
          <option value="Lampadas">Lampadas</option>
          <option value="Jardinagem">Jardinagem</option>
          <option value="RodasVassouras">Rodas / Vassouras</option>
          <option value="Praia">Praia</option>
          <option value="Tapetes">Tapetes</option>
        </select>
        <select onChange={onResponsavelChange} value={responsavel}>
          <option value="Teste-5512992269582">Teste</option>
          <option value="Nataly-5512997258238">Nataly</option>
          <option value="Lucas-5512991812970">Lucas R</option>
          <option value="Kamilly-5512997060657">Kamilly</option>
          <option value="Welligton-5512988483325">Welligton</option>
          <option value="Joze-5512996306481">Joze Elen</option>
          <option value="Vitoria-5512997666163">Vitoria</option>
          <option value="Douglas-5512991665999">Douglas</option>
          <option value="Pietra-55129922006228">Pietra</option>
          <option value="Jessica-5512997217113">Jessica</option>
        </select>
      </div>
      <SectionLimpeza
        observacaoLimpeza={observacaoLimpeza}
        setObservacaoLimpeza={setObservacaoLimpeza}
        setStarsLimpeza={setStarsLimpeza}
        starsLimpeza={starsLimpeza}
        imagesLimpezaSrc={imagesLimpezaSrc}
        setImagesLimpezaSrc={setImagesLimpezaSrc}
        setVideosLimpezaSrc={setVideosLimpezaSrc}
        videosLimpezaSrc={videosLimpezaSrc}
      />
      <SectionOrganizacao
        observacaoOrganizacao={observacaoOrganizacao}
        setObservacaoOrganizacao={setObservacaoOrganizacao}
        setStarsOrganizacao={setStarsOrganizacao}
        starsOrganizacao={starsOrganizacao}
        imagesOrganizacaoSrc={imagesOrganizacaoSrc}
        setImagesOrganizacaoSrc={setImagesOrganizacaoSrc}
        setVideosOrganizacaoSrc={setVideosOrganizacaoSrc}
        videosOrganizacaoSrc={videosOrganizacaoSrc}
      />
      <SectionDisposicaoProdutos
        observacaoDisposicaoProdutos={observacaoDisposicaoProdutos}
        starsDisposicaoProdutos={starsDisposicaoProdutos}
        setStarsDisposicaoProdutos={setStarsDisposicaoProdutos}
        setObservacaoDisposicaoProdutos={setObservacaoDisposicaoProdutos}
        imagesDisposicaoProdutosSrc={imagesDisposicaoProdutosSrc}
        setImagesDisposicaoProdutosSrc={setImagesDisposicaoProdutosSrc}
        setVideosDisposicaoProdutosSrc={setVideosDisposicaoProdutosSrc}
        videosDisposicaoProdutosSrc={videosDisposicaoProdutosSrc}
      />
      <SectionPrecificacao
        observacaoPrecificacao={observacaoPrecificacao}
        starsPrecificacao={starsPrecificacao}
        precificacaoProdutoOneCode={precificacaoProdutoOneCode}
        precificacaoProdutoOneValorPrateleira={
          precificacaoProdutoOneValorPrateleira
        }
        precificacaoProdutoOneValorSistema={precificacaoProdutoOneValorSistema}
        precificacaoProdutoTwoCode={precificacaoProdutoTwoCode}
        precificacaoProdutoTwoValorPrateleira={
          precificacaoProdutoTwoValorPrateleira
        }
        precificacaoProdutoTwoValorSistema={precificacaoProdutoTwoValorSistema}
        setStarsPrecificacao={setStarsPrecificacao}
        setObservacaoPrecificacao={setObservacaoPrecificacao}
        setPrecificacaoProdutoOneCode={setPrecificacaoProdutoOneCode}
        setPrecificacaoProdutoOneValorPrateleira={
          setPrecificacaoProdutoOneValorPrateleira
        }
        setPrecificacaoProdutoOneValorSistema={
          setPrecificacaoProdutoOneValorSistema
        }
        setPrecificacaoProdutoTwoCode={setPrecificacaoProdutoTwoCode}
        setPrecificacaoProdutoTwoValorPrateleira={
          setPrecificacaoProdutoTwoValorPrateleira
        }
        setPrecificacaoProdutoTwoValorSistema={
          setPrecificacaoProdutoTwoValorSistema
        }
        imagesPrecificacaoSrc={imagesPrecificacaoSrc}
        setImagesPrecificacaoSrc={setImagesPrecificacaoSrc}
        setVideosPrecificacaoSrc={setVideosPrecificacaoSrc}
        videosPrecificacaoSrc={videosPrecificacaoSrc}
      />
      <SectionValidadeProdutos
        validadeProdutosOne={validadeProdutosOne}
        validadeProdutosOneDate={validadeProdutosOneDate}
        validadeProdutosTwo={validadeProdutosTwo}
        validadeProdutosTwoDate={validadeProdutosTwoDate}
        observacaoValidadeProdutos={observacaoValidadeProdutos}
        setObservacaoValidadeProdutos={setObservacaoValidadeProdutos}
        setValidadeProdutosOne={setValidadeProdutosOne}
        setValidadeProdutosOneDate={setValidadeProdutosOneDate}
        setValidadeProdutosTwo={setValidadeProdutosTwo}
        setValidadeProdutosTwoDate={setValidadeProdutosTwoDate}
        setStarsValidade={setStarsValidade}
        starsValidade={starsValidade}
        imagesValidadeProdutosSrc={imagesValidadeProdutosSrc}
        setImagesValidadeProdutosSrc={setImagesValidadeProdutosSrc}
        setVideosValidadeProdutosSrc={setVideosValidadeProdutosSrc}
        videosValidadeProdutosSrc={videosValidadeProdutosSrc}
      />
      <SectionEmbalagens
        observacaoEmbalagens={observacaoEmbalagens}
        starsEmbalagens={starsEmbalagens}
        setObservacaoEmbalagens={setObservacaoEmbalagens}
        setStarsEmbalagens={setStarsEmbalagens}
        imagesEmbalagensSrc={imagesEmbalagensSrc}
        setImagesEmbalagensSrc={setImagesEmbalagensSrc}
        setVideosEmbalagensSrc={setVideosEmbalagensSrc}
        videosEmbalagensSrc={videosEmbalagensSrc}
      />
      <footer>
        <input
          type="text"
          placeholder="Avaliador"
          value={avaliador}
          onChange={onAvaliadorChange}
        />
        <button onClick={submitForm}>Enviar avaliação</button>
      </footer>
      <div className={style.backupFooter}>
        {avaliacoes.map((avaliacao, index) => (
          <div key={`${index}-avaliacao`}>
            <button
              onClick={() => {
                if (
                  confirm(
                    `Deseja reenviar a avaliação do ${avaliacao.resposavel}`
                  )
                ) {
                  sendAvaliacaoBackup(avaliacao);
                }
              }}
            >
              {avaliacao.resposavel} - {avaliacao.date}
            </button>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
