

export const store = configureStore({
    reducer: {
        user: userReducer,
        activity: activityReducer,
    },
})