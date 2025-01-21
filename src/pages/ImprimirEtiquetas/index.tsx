import { ChangeEvent, useEffect, useState } from "react";
import style from "./index.module.css";
import { formatDate } from "../../utils/formats";
import { List, ListItem } from "../../interfaces";

import { FaPrint } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import { ciAxios } from "../../utils/ciAxios";
import { toastPromise } from "../../utils/toast";

export function ImprimirEtiquetas() {
  const [lists, setLists] = useState<List[]>();
  const [listDetails, setListDetails] = useState<ListItem[]>();
  const [codlistc, setCodlistc] = useState(0);
  const [typeEtiqueta, setTypeEtiqueta] = useState("estoque");
  const codfir = localStorage.getItem("codfir");

  const date = new Date();
  const days30Ago = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);

  const onSelectedList = async (codlistc: number) => {
    const url = `${import.meta.env.VITE_SERVER_NODE_URL}/movlist/detalhes`;
    setCodlistc(codlistc);

    const { data } = await toastPromise({
      asyncFunction: ciAxios.post<ListItem[]>(url, {
        codlistc,
      }),
      pendingMessage: "Carregando itens",
      onError: "Tentando novamente",
    });

    const sortedList = data.sort((a, b) => {
      if (a.FAMILIA && b.FAMILIA) {
        return a.FAMILIA.localeCompare(b.FAMILIA);
      }
      return 0;
    });
    setListDetails(sortedList);
  };

  const getLists = async () => {
    const { data } = await toastPromise({
      asyncFunction: ciAxios.get<List[]>(
        `${
          import.meta.env.VITE_SERVER_NODE_URL
        }/movlist/consulta?firma=${codfir}&data=${days30Ago}`
      ),
      pendingMessage: "Carregando listas",
      onError: {
        render() {
          setTimeout(() => {
            getLists();
          }, 3000);
          return "Tentando novamente";
        },
      },
    });

    setLists(data.reverse());
  };

  const selectAllCheckBox = () => {
    const checkAll = document.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox']"
    );
    checkAll.forEach((input, index) => {
      if (index !== 0) {
        input.checked = checkAll[0].checked;
      }
    });
  };

  const getValorVenda = async (codpro: string): Promise<number> => {
    const { data } = await ciAxios.post(
      `${import.meta.env.VITE_SERVER_NODE_URL}/pesquisa_produtos`,
      {
        codpro,
        firm: codfir,
      }
    );
    return data[0].VRVENDA as number;
  };

  const onChangeTypeEtiqueta = (event: ChangeEvent<HTMLSelectElement>) => {
    setTypeEtiqueta(event.target.value);
  };

  const print = async () => {
    const allChecks = document.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox']:checked"
    );

    const page = window.open();
    let script = "";

    let body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"></script>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
    
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Roboto", sans-serif;
          }
    
          .A4 {
            width: 100%;
            height: 1123px;
            max-height: 1123px;
            min-height: 1123px;
            border: 4px solid black;
            padding: 51px 14px 0px 16px;
            flex-basis: 200px;
          }
    
          .container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            ${
              typeEtiqueta === "etiqueta amarela"
                ? "flex-direction: column;"
                : ""
            }
          }
    
          img {
            height: 160px;
            width: 160px;
          }
    
          h1 {
            text-align: center;
            font-size: 40px;
          }
    
          .local {
            font-size: 12px;
          }
    
          .row {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }
    
          .estoqueContainer .rowContainer {
            display: flex;
            width: 100%;
          }
          
          .etiquetaAmarelaContainer {
            width: 264px;
            height: 112px;
            min-height: 112px;
            max-height: 112px;
            padding: 4px 0px 0px 26px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .etiquetaAmarelaContainer h2{
            font-weight: 300;
            font-size: 17.5px;
            text-align: center;
            line-height: 16px;
          }

          .rowEtiquetaAmarelaContainer {
            display: flex;
            width: 100%;
            height: 22px;
            z-index: -999;
          }

          .rowEtiquetaAmarelaContainer div{
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }
          
          .etiquetaAmarelaContainer h1{
            text-align: center;
            font-size: 32px;
            line-height: 22px
          }

          .etiquetaGrandeContainer {
            width: 48%;
            padding: 8px;
            height: 260px;
            min-height: 256px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 2px;
            gap: 2px;
            border: 1px solid black;
          }
    
          .etiquetaGrandeContainer h2 {
            font-size: 28px;
            text-align: center;
            font-weight: 500;
          }

          .etiquetaGrandeContainer h1{
            text-align: center;
            font-size: 56px;
          }

          .etiquetaGrandeContainer h3{
            position: relative;
            top: 10px;
          }

          .etiquetaGrandeContainer h4{
            text-align: center;
            font-weight: 500;
            font-size: 20px;
          }
    
          .etiquetaGrandeContainer .rowRight .codpro {
            font-size: 20px;
          }

          .etiquetaGrandeContainer .rowContainer{
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            width: 100%;
          }

          .etiquetaGrandeContainer footer{
            display: flex;
            gap: 8px;
            justify-content: center;
          }
    
          .rowRight {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            width: 68%;
            padding: 8px;
          }
    
          .rowRight div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
    
          .estoqueContainer .rowContainer img {
            width: 32%;
          }
    
          .estoqueContainer {
            width: 50%;
            padding: 8px;
            height: 256px;
            min-height: 256px;
            max-height: 256px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 2px;
          }
    
          .estoqueContainer h2 {
            font-size: 22px;
            text-align: center;
            font-weight: 500;
          }
    
          .estoqueContainer .rowRight .local {
            font-size: 16px;
          }
    
          .estoqueContainer .rowRight .codpro {
            font-size: 20px;
          }
    
          .precoContainer {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 50%;
            height: 256px;
            min-height: 256px;
            max-height: 256px;
            padding: 8px;
            border: 1px solid #111;
          }
    
          .precoContainer h2 {
            font-size: 24px;
            text-align: center;
            font-weight: 500;
          }
    
          .precoContainer h1 {
            text-align: center;
            font-size: 54px;
            display: inline-block;
          }
    
          .precoContainer h3 {
            position: relative;
            top: 12px;
          }
    
          .precoContainer .rowPreco {
            display: flex;
            justify-content: center;
            gap: 8px;
          }
    
          .precoContainer .rowRight .local {
            font-size: 14px;
          }
    
          .precoContainer .rowRight .codpro {
            font-size: 16px;
          }
    
          .precoContainer .row {
            justify-content: space-evenly;
          }
    
          .precoContainer .footer {
            display: flex;
            justify-content: center;
          }
    
          .precoContainer .footer p {
            font-size: 18px;
          }

          button{
            padding: 16px;
            font-size: 16px;
            margin: 16px;
          }
    
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <button onclick="window.print()">Imprimir</button>
          ${typeEtiqueta === "estoque" ? `<section class="A4">` : ""}
          ${typeEtiqueta === "etiqueta grande" ? `<section class="A4">` : ""}
          <div class="container">
    `;

    let cont = 1;
    if (listDetails) {
      for (const input of allChecks) {
        const id = Number(input.id);
        let repeticoes = listDetails[id].QTDADE;
        if (typeEtiqueta === "etiqueta amarela") {
          repeticoes = 1;
        }
        if (typeEtiqueta === "etiqueta grande") {
          repeticoes = 1;
        }
        for (let c = 0; c < repeticoes; c++) {
          if (input.id && listDetails) {
            const vrVenda = await getValorVenda(listDetails[id].CODPRO);
            const imgSrc = `http://192.168.100.100:9060/fotos/P${listDetails[
              id
            ].CODPRO.replace(".", "")}.jpg?v=${Date.now()}`;

            const codpro = listDetails[id].CODPRO;
            const svgId = `P${listDetails[id].CODPRO.replace(".", "")}`;
            const local = listDetails[id].LOCAL ? listDetails[id].LOCAL : "";
            const ean = listDetails[id].EAN;
            const desc = listDetails[id].DESCR;
            const coduni = listDetails[id].CODUNI;
            const vrVendaFormatted = vrVenda
              .toFixed(2)
              .toString()
              .replace(".", ",");

            script += `
              JsBarcode("#${svgId}", "${ean}", {
                ${typeEtiqueta === "etiqueta amarela" ? "height: 8," : ""}
                ${typeEtiqueta === "etiqueta grande" ? "height: 16," : ""}
                ${typeEtiqueta === "estoque" ? "height: 30," : ""}
                width: 1,
                ${typeEtiqueta === "etiqueta amarela" ? "fontSize: 12" : ""}
                ${typeEtiqueta === "etiqueta grande" ? "fontSize: 12" : ""}
                ${typeEtiqueta === "estoque" ? "fontSize: 14" : ""}
              })
            `;
            if (typeEtiqueta === "estoque") {
              body += `
              <div class="estoqueContainer">
                <div class="rowContainer">
                  <img loading="lazy" src="${imgSrc}" alt=""/>
                  <div class="rowRight">
                    <div>
                      <p class="codpro">${codpro}</p>
                      <svg id="${svgId}"></svg>
                    </div>
                    <p class="local">Local: ${local}</p>
                  </div>
                </div>
                <h2>${desc}</h2>
              </div>
              ${
                cont % 8 === 0
                  ? `
              </div>
              </section>
              <section class="A4">
              <div class="container">
              `
                  : ""
              }
              `;
            } else if (typeEtiqueta === "etiqueta grande") {
              body += `
              <div class="etiquetaGrandeContainer">
                <div class="rowContainer">
                  <p class="codpro">${codpro}</p>
                  <svg id="${svgId}"></svg>
                </div>
                <h2>${desc}</h2>
                <footer>
                  <h1>R$ ${vrVendaFormatted}</h1>
                  <h3>/ ${coduni}</h3>
                </footer>
                <h4>à vista 5%</h4>
              </div>
              ${
                cont % 8 === 0
                  ? `
              </div>
              </section>
              <section class="A4">
              <div class="container">
              `
                  : ""
              }
              `;
            } else if (typeEtiqueta === "etiqueta amarela") {
              body += `
              <div class="etiquetaAmarelaContainer">
                <div class="rowEtiquetaAmarelaContainer">
                  <div>
                    <p class="codpro">${codpro}</p>
                    <svg id="${svgId}"></svg>
                  </div>
                </div>
                <h2>${desc}</h2>
                <h1>R$ ${vrVendaFormatted}</h1>
              </div>
              `;
            }
            cont++;
          }
        }
      }
    }

    script += `
    window.onafterprint = () => {
      close()
    }
    `;

    body += `
        </section>
        <script>
          ${script}
        </script>
      </main>
    </body>
  </html>    
    `;
    page?.document.write(body);
  };

  useEffect(() => {
    getLists();
  }, []);

  return (
    <section className={style.imprimirEtiquetasContainer}>
      <h2>Impressão Etiquetas</h2>
      {lists && (
        <div className={style.tableWrapper}>
          <table className={style.tableFixHead}>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Usuario</th>
                <th>Data</th>
                <th>Quantidade Itens</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists.map((list) => (
                  <tr
                    onClick={() => onSelectedList(list.CODLISTC)}
                    key={uuid()}
                  >
                    <td>{list.CODLISTC}</td>
                    <td>{list.NOME}</td>
                    <td>{formatDate(list.DTEMIS)}</td>
                    <td>{list.TOTAL_ITENS}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {codlistc > 0 && (
        <>
          <h1>Lista - {codlistc}</h1>
          <div className={style.tableWrapper}>
            <table className={style.tableFixHead}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onClick={selectAllCheckBox} />
                  </th>
                  <th>CODPRO</th>
                  <th>EAN</th>
                  <th>Descrição</th>
                  <th>Localização</th>
                  <th>UN</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {listDetails &&
                  listDetails.map((item, index) => (
                    <tr key={uuid()}>
                      <td>
                        <input type="checkbox" id={index.toString()} />
                      </td>
                      <td>{item.CODPRO}</td>
                      <td>{item.EAN}</td>
                      <td>{item.DESCR}</td>
                      <td>{item.LOCAL}</td>
                      <td>{item.CODUNI}</td>
                      <td>{item.QTDADE}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <footer>
            <select value={typeEtiqueta} onChange={onChangeTypeEtiqueta}>
              <option value="estoque">Estoque</option>
              <option value="etiqueta amarela">Etiqueta amarela</option>
              <option value="etiqueta grande">Etiqueta grande</option>
            </select>
            <button onClick={print}>
              Imprimir <FaPrint />
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
