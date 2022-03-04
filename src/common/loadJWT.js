export default function loadJWT({children}) {
    const loadJWT = useCallback(async () => {
        try {
            const value = await SecureStore.getItemAsync('token');
    
            authContext.setAuthState({
                accessToken: value || null,
                authenticated: value !== null,
            });
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.log(`Keychain Error: ${error.message}`);
            authContext.setAuthState({
                accessToken: null,
                authenticated: false,
            });
        }
    }, []);
    
    useEffect(() => {
        loadJWT();
    }, [loadJWT]);

  return (
    {...children}
  )
}

