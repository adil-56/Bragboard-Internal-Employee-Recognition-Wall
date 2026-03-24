import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, ShoppingBag, Zap, CheckCircle, Clock, XCircle, Package } from "lucide-react"
import api from "../api/axios"
import { AppLayout } from "../components/layout/AppLayout"
import { useToast } from "../contexts/ToastContext"
const STATUS_BADGE = {
    pending: { label: "Pending", icon: Clock, cls: "badge-neutral" },
    shipped: { label: "Shipped", icon: Package, cls: "badge-primary" },
    fulfilled: { label: "Fulfilled", icon: CheckCircle, cls: "bg-success-50 text-success-700 border border-success-200" },
    cancelled: { label: "Cancelled", icon: XCircle, cls: "bg-danger-50 text-danger-700 border border-danger-200/60" },
}

const Rewards = () => {
    const navigate = useNavigate()
    const [rewards, setRewards] = useState([])
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [redeeming, setRedeeming] = useState(null)
    const { showToast } = useToast()
    const [tab, setTab] = useState("catalog") // "catalog" | "orders"

    useEffect(() => {
        Promise.all([
            api.get("/users/me"),
            api.get("/rewards/"),
            api.get("/rewards/my-orders"),
        ]).then(([userRes, rewardsRes, ordersRes]) => {
            setUser(userRes.data)
            setRewards(rewardsRes.data)
            setOrders(ordersRes.data)
        }).catch(() => navigate("/login"))
            .finally(() => setLoading(false))
    }, [])


    const handleRedeem = async (reward) => {
        setRedeeming(reward.id)
        try {
            const res = await api.post(`/rewards/${reward.id}/redeem`)
            setUser(prev => ({ ...prev, redeemable_points: res.data.remaining_points }))
            const ordersRes = await api.get("/rewards/my-orders")
            setOrders(ordersRes.data)
            showToast(`🎉 Redeemed "${reward.name}" successfully!`)
            setTab("orders")
        } catch (err) {
            showToast(err.response?.data?.detail || "Redemption failed.", "error")
        } finally {
            setRedeeming(null)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <AppLayout>
            <div>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-h1 text-neutral-900">Rewards</h1>
                            <p className="text-body text-neutral-500 mt-1">Redeem your points for perks and rewards.</p>
                        </div>
                        {/* Points balance pill */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-body font-bold text-amber-700">{user?.redeemable_points ?? 0}</span>
                            <span className="text-body-sm text-amber-600 font-medium">pts available</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-6 bg-neutral-100 rounded-xl p-1 w-fit">
                        {[
                            { key: "catalog", label: "Catalog", icon: Gift },
                            { key: "orders", label: "My Orders", icon: ShoppingBag },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-medium transition-all
                  ${tab === key ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
                            >
                                <Icon className="w-3.5 h-3.5" />{label}
                                {key === "orders" && orders.length > 0 && (
                                    <span className="badge badge-neutral text-xs ml-0.5">{orders.length}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Catalog tab */}
                {tab === "catalog" && (
                    <div>
                        {rewards.length === 0 ? (
                            <div className="card card-section text-center py-16">
                                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-h3 text-neutral-700 mb-1">No rewards yet</h3>
                                <p className="text-body text-neutral-400">Ask your admin to add rewards to the catalog.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rewards.map((reward, i) => {
                                    const canAfford = (user?.redeemable_points ?? 0) >= reward.points_cost
                                    const outOfStock = reward.stock_quantity === 0
                                    return (
                                        <motion.div
                                            key={reward.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="card card-section flex flex-col gap-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                                                    <Gift className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <span className={`badge ${outOfStock ? "badge-neutral" : "badge-amber"}`}>
                                                    <Zap className="w-3 h-3" />
                                                    {outOfStock ? "Out of stock" : `${reward.points_cost} pts`}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-h3 text-neutral-900 mb-1">{reward.name}</h3>
                                                {reward.description && (
                                                    <p className="text-body-sm text-neutral-500">{reward.description}</p>
                                                )}
                                                {reward.stock_quantity > 0 && (
                                                    <p className="text-caption text-neutral-400 mt-2">{reward.stock_quantity} left in stock</p>
                                                )}
                                                {reward.stock_quantity === -1 && (
                                                    <p className="text-caption text-neutral-400 mt-2">Unlimited stock</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleRedeem(reward)}
                                                disabled={!canAfford || outOfStock || redeeming === reward.id}
                                                className={`w-full py-2.5 rounded-lg text-body-sm font-semibold transition-all
                          ${canAfford && !outOfStock
                                                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                                                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed"}`}
                                            >
                                                {redeeming === reward.id ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                                ) : outOfStock ? "Out of stock" : !canAfford ? `Need ${reward.points_cost - (user?.redeemable_points ?? 0)} more pts` : "Redeem"}
                                            </button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Orders tab */}
                {tab === "orders" && (
                    <div>
                        {orders.length === 0 ? (
                            <div className="card card-section text-center py-16">
                                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-h3 text-neutral-700 mb-1">No orders yet</h3>
                                <p className="text-body text-neutral-400">Redeem a reward from the catalog to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order, i) => {
                                    const { label, icon: StatusIcon, cls } = STATUS_BADGE[order.status] || STATUS_BADGE.pending
                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="card card-section flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Gift className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-body font-semibold text-neutral-900">{order.reward_name}</h4>
                                                <p className="text-caption text-neutral-400">
                                                    {new Date(order.ordered_at).toLocaleString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                        hour: "2-digit", minute: "2-digit",
                                                    })}
                                                    {" · "}{order.points_cost} pts
                                                </p>
                                            </div>
                                            <span className={`badge flex items-center gap-1 ${cls}`}>
                                                <StatusIcon className="w-3 h-3" />{label}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

export default Rewards
