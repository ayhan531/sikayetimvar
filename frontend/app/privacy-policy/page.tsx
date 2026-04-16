"use client";

import { Box, Container, Stack, Typography, Breadcrumbs, Link as MuiLink, Divider } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
              <MuiLink component={Link} href="/" underline="hover" sx={{ color: "#6B7280" }}>Ana Sayfa</MuiLink>
              <Typography sx={{ color: "#1E6E4F", fontWeight: 600 }}>Gizlilik Politikası</Typography>
            </Breadcrumbs>

            <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#fff", border: "1px solid #E5E7EB", mb: 4 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#1E6E4F" }}>
                  <Typography variant="h4" sx={{ color: "#fff" }}>🛡️</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#1F2937" }}>Gizlilik Politikası</Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>Son güncelleme: 1 Ocak 2026</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>1. Giriş</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Şikayetimvar olarak gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını önemsiyoruz. Bu gizlilik politikası, platformumuzda hangi bilgileri topladığımızı, bu bilgileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>2. Topladığımız Bilgiler</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8, mb: 2 }}>
                    Aşağıdaki bilgileri topluyoruz:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1"><strong>Kayıt Bilgileri:</strong> Ad, soyad, e-posta adresi</Typography>
                    <Typography component="li" variant="body1"><strong>Profil Bilgileri:</strong> Telefon, şehir, biyografi, profil fotoğrafı</Typography>
                    <Typography component="li" variant="body1"><strong>Şikayet İçerikleri:</strong> Paylaştığınız şikayetler ve yorumlar</Typography>
                    <Typography component="li" variant="body1"><strong>Kanıtlar:</strong> Yüklediğiniz dosya ve belgeler</Typography>
                    <Typography component="li" variant="body1"><strong>Etkileşim Verileri:</strong> Beğeniler, yorumlar, görüntülenme sayıları</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>3. Bilgilerin Kullanımı</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Topladığımız bilgileri şu amaçlarla kullanıyoruz:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, mt: 1, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Platform hizmetlerini sunmak ve geliştirmek</Typography>
                    <Typography component="li" variant="body1">Hesabınızı oluşturmak ve yönetmek</Typography>
                    <Typography component="li" variant="body1">Şikayetlerinizi işlemek ve takip etmek</Typography>
                    <Typography component="li" variant="body1">Puan ve rütbe sisteminizi güncellemek</Typography>
                    <Typography component="li" variant="body1">Güvenlik önlemlerini sağlamak</Typography>
                    <Typography component="li" variant="body1">Yasal yükümlülüklerimizi yerine getirmek</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>4. Bilgi Paylaşımı</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, mt: 1, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Açık rızanız olduğunda</Typography>
                    <Typography component="li" variant="body1">Yasal zorunluluk bulunduğunda</Typography>
                    <Typography component="li" variant="body1">Hizmet sağlayıcılarımızla (hosting, analitik vb.)</Typography>
                    <Typography component="li" variant="body1">Şikayetin işlenmesi için gerekli olduğunda</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>5. Veri Güvenliği</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Bu önlemler arasında şifreleme, güvenli sunucular, erişim kontrolleri ve düzenli güvenlik denetimleri yer almaktadır.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>6. Veri Saklama</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verilerinizi, yasal saklama süreleri ve işleme amaçlarının gerektirdiği süre boyunca saklıyoruz. Hesabınızı sildiğinizde, verileriniz yasal yükümlülüklerimiz saklı kalmak kaydıyla silinir.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>7. Haklarınız</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verileriniz üzerindeki haklarınız şunlardır:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, mt: 1, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Verilerinize erişim hakkı</Typography>
                    <Typography component="li" variant="body1">Verilerinizin düzeltilmesini talep etme hakkı</Typography>
                    <Typography component="li" variant="body1">Verilerinizin silinmesini talep etme hakkı</Typography>
                    <Typography component="li" variant="body1">Veri işlemeye itiraz etme hakkı</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>8. İletişim</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Gizlilik politikamız hakkında sorularınız için info@sikayetimvar.com adresinden bize ulaşabilirsiniz.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
