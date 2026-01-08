
// O CarbonCar agora opera no modo Local-First. 
// Todas as operações de banco de dados foram migradas para persistência em localStorage e estado do React.
export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: null } }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {},
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null })
    },
    from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }), maybeSingle: () => ({ data: null, error: null }), order: () => ({ data: [], error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) })
    })
};
