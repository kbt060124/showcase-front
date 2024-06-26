import { useAuth } from '@/hooks/auth'
import Footer from './Footer'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div>
            <div className="min-h-screen">
                {/* Page Content */}
                <main>{children}</main>
            </div>
            <footer className="fixed bottom-0 bg-white p-3 flex justify-between items-end w-full">
                <Footer user={user} />
            </footer>
        </div>
    )
}

export default AppLayout
