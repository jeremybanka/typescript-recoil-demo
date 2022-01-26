import type { FC } from "react"
import { useState } from "react"

import { prettyPrintJson } from "pretty-print-json"
import { useRecoilSnapshot } from "recoil"
import styled from "styled-components"

import "./json.scss"

const Atom = styled.pre`
  background: #eeea;
  border-radius: 3px;
  margin: 5px 0;
  font-size: 17px;
  width: 100%;
  display: inline-block;
  h1 {
    font-size: 17px;
    margin: 5px 0;
    display: inline;
  }
`

const RecoilIcon = styled.button`
  /* height: 100px;
  width: 100px;
  align-self: flex-end;
  cursor: pointer;
  //z-index: 1000;
  pointer-events: all; */
`

const Layer = styled.div`
  /* pointer-events: none;
  overflow-y: scroll;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column-reverse;
  z-index: 1000; */
`

const parseParamToJson = (param: string) => {
  let parsable: any = param
  if (param === undefined) {
    return ``
  }
  if (param[0] === `"`) {
    parsable = param.slice(1, -1)
  }
  // else {
  //   const [identifier, innerParam] = param.split(`/`)
  //   parsable = JSON.parse(innerParam)
  // }
  return prettyPrintJson.toHtml(parsable)
}

export const DebugInspector: FC = () => {
  const snapshot = useRecoilSnapshot()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState(``)

  // useEffect(() => {
  //   console.debug('The following atoms were modified:');
  //   for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
  //     console.debug(node.key, snapshot.getLoadable(node));
  //   }
  // }, [snapshot]);

  return (
    <Layer>
      <RecoilIcon type="button" onClick={() => setIsOpen(!isOpen)}>
        R
      </RecoilIcon>

      {isOpen && (
        <>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} />
          {Array.from(snapshot.getNodes_UNSTABLE())
            .filter((node) => node.key.includes(filter))
            .map((node) => {
              const key = node.key.split(`__`)[0]
              const param = node.key.split(`__`)[1]
              const { contents } = snapshot.getLoadable(node)
              const data =
                contents instanceof Set ? Array.from(contents) : contents
              // console.log(data)
              return (
                <Atom key={node.key}>
                  <h1>{key}: </h1>
                  {param && (
                    <>
                      <output
                        className="param"
                        dangerouslySetInnerHTML={{
                          __html: parseParamToJson(param),
                        }}
                      />
                      {`: `}
                    </>
                  )}
                  <output
                    dangerouslySetInnerHTML={{
                      __html: prettyPrintJson.toHtml(data, { indent: 2 }),
                    }}
                  />
                </Atom>
              )
            })}
        </>
      )}
    </Layer>
  )
}
