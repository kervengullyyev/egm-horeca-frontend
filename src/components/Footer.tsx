"use client";

import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="mt-16 w-full bg-gray-100">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
					{/* Company Info */}
					<div className="lg:col-span-2">
						<div className="text-xl font-semibold tracking-tight">EGM HORECA</div>
						<p className="mt-3 max-w-sm text-sm text-foreground/70">
							{t('bottomTagline')}
						</p>
						
						{/* Contact Info */}
						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-3">
								<Mail className="w-4 h-4 text-gray-600" />
								<a 
									href="mailto:info@egmhoreca.com" 
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									info@egmhoreca.com
								</a>
							</div>
							<div className="flex items-center gap-3">
								<Phone className="w-4 h-4 text-gray-600" />
								<a 
									href="tel:+40741302753" 
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									+40 741 302 753
								</a>
							</div>
							<div className="flex items-center gap-3">
								<MessageCircle className="w-4 h-4 text-gray-600" />
								<a 
									href="https://wa.me/40741302753" 
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									WhatsApp: +40 741 302 753
								</a>
							</div>
							<div className="flex items-center gap-3">
								<MapPin className="w-4 h-4 text-gray-600" />
								<a 
									href="https://maps.google.com/?q=Bucharest,Romania" 
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Bucharest, Romania
								</a>
							</div>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-sm font-semibold text-foreground">{t('quickLinks')}</h4>
						<ul className="mt-3 space-y-2 text-sm text-foreground/70">
							<li>
								<Link href="/" className="hover:text-foreground transition-colors">
									{t('home')}
								</Link>
							</li>
							<li>
								<Link href="/about" className="hover:text-foreground transition-colors">
									{t('aboutUs')}
								</Link>
							</li>
							<li>
								<Link href="/search" className="hover:text-foreground transition-colors">
									{t('search')}
								</Link>
							</li>
							<li>
								<Link href="/category/plates" className="hover:text-foreground transition-colors">
									{t('plates')}
								</Link>
							</li>
							<li>
								<Link href="/category/cups" className="hover:text-foreground transition-colors">
									{t('cups')}
								</Link>
							</li>
							<li>
								<Link href="/category/cutlery" className="hover:text-foreground transition-colors">
									{t('cutlery')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="text-sm font-semibold text-foreground">{t('support')}</h4>
						<ul className="mt-3 space-y-2 text-sm text-foreground/70">
							<li>
								<Link href="/contact" className="hover:text-foreground transition-colors">
									{t('contactUs')}
								</Link>
							</li>
							<li>
								<Link href="/cart" className="hover:text-foreground transition-colors">
									{t('cart')}
								</Link>
							</li>
							<li>
								<Link href="/account" className="hover:text-foreground transition-colors">
									{t('account')}
								</Link>
							</li>
							<li>
								<Link href="/checkout" className="hover:text-foreground transition-colors">
									{t('checkout')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="text-sm font-semibold text-foreground">{t('legal')}</h4>
						<ul className="mt-3 space-y-2 text-sm text-foreground/70">
							<li>
								<Link href="/privacy" className="hover:text-foreground transition-colors">
									{t('privacyPolicy')}
								</Link>
							</li>
							<li>
								<Link href="/terms" className="hover:text-foreground transition-colors">
									{t('termsOfService')}
								</Link>
							</li>
							<li>
								<Link href="/shipping" className="hover:text-foreground transition-colors">
									{t('shippingInfo')}
								</Link>
							</li>
							<li>
								<Link href="/returns" className="hover:text-foreground transition-colors">
									{t('returns')}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-10 pt-8 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-sm text-foreground/70">
							© 2024 EGM HORECA. {t('rightsReserved')}
						</p>
						<div className="flex items-center gap-6 text-sm text-foreground/70">
							<span>{t('bottomTagline')}</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}


