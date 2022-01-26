import type { FC, PropsWithChildren } from "react"

import type { RecoilState } from "recoil"
import { useRecoilState } from "recoil"

type RadioButtonProps<T> = {
  state: RecoilState<T>
  options: T[]
}

export const RadioButtons = <T extends number | string>(
  props: PropsWithChildren<RadioButtonProps<T>>
): ReturnType<FC> => {
  const { options, state } = props
  const [value, setValue] = useRecoilState(state)
  return (
    <>
      {options.map((v) => (
        <label key={v}>
          <input
            type="radio"
            name="radio"
            value={v}
            checked={v === value}
            onChange={() => setValue(v)}
          />
          <div className="border" />
          <span>{v}</span>
        </label>
      ))}
    </>
  )
}
