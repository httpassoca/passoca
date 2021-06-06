import { MutationTree } from 'vuex'

export const state = () => ({
  darkMode: true
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  CHANGE_THEME: state => (state.darkMode = !state.darkMode)
}
