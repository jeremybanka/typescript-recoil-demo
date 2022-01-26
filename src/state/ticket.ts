import { DefaultValue, atomFamily, selectorFamily } from "recoil"

export type Ticket = {
  id: string
  points: 1 | 2 | 3 | 5 | 8
  concern: `bug` | `enhancement` | `feature`
}

const EMPTY_TICKET: Ticket = {
  id: ``,
  points: 1,
  concern: `bug`,
}

export const findTicketState = atomFamily<Ticket, string>({
  key: `ticket`,
  default: EMPTY_TICKET,
})

export const findTicketPoints = selectorFamily<Ticket[`points`], string>({
  key: `ticketPoints`,
  get:
    (id: string) =>
    ({ get }) => {
      const ticket = get(findTicketState(id))
      return ticket.points
    },
  set:
    (id: string) =>
    ({ get, set, reset }, points: DefaultValue | Ticket[`points`]) => {
      const ticketState = findTicketState(id)
      if (points instanceof DefaultValue) {
        reset(ticketState)
        return
      }
      const ticket = get(ticketState)
      const newTicket = { ...ticket, points }
      set(ticketState, newTicket)
    },
})
