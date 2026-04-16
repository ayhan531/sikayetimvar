"use client";

import { Box, Container, Stack, Typography, Breadcrumbs, Link as MuiLink, Divider } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function TermsOfUsePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
              <MuiLink component={Link} href="/" underline="hover" sx={{ color: "#6B7280" }}>Ana Sayfa</MuiLink>
              <Typography sx={{ color: "#1E6E4F", fontWeight: 600 }}>Kullanım Koşulları</Typography>
            </Breadcrumbs>

            <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#fff", border: "1px solid #E5E7EB", mb: 4 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#1E6E4F" }}>
                  <Typography variant="h4" sx={{ color: "#fff" }}>📜</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#1F2937" }}>Kullanım Koşulları</Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>Son güncelleme: 1 Ocak 2026</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>1. Kabul</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Şikayetimvar platformunu kullanarak, bu kullanım koşullarını kabul etmiş sayılırsınız. Eğer bu koşulları kabul etmiyorsanız, platformu kullanmamalısınız.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>2. Hizmet Açıklaması</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Şikayetimvar, tüketicilerin şikayetlerini paylaşabilecekleri ve diğer kullanıcılarla etkileşime girebilecekleri bir platformdur. Platform, şikayetlerin toplanması, paylaşılması ve yönetilmesi için tasarlanmıştır.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>3. Kullanıcı Yükümlülükleri</Typography>
                  <Stack spacing={2}>
                    <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                      Platformu kullanırken aşağıdaki kurallara uymalısınız:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, listStyleType: "disc" }}>
                      <Typography component="li" variant="body1">Gerçek ve doğru bilgiler sağlamalısınız</Typography>
                      <Typography component="li" variant="body1">Hakaret, tehdit veya yasadışı içerik paylaşmamalısınız</Typography>
                      <Typography component="li" variant="body1">Başkalarının gizliliğine saygı göstermelisiniz</Typography>
                      <Typography component="li" variant="body1">Spam veya reklam amaçlı içerik paylaşmamalısınız</Typography>
                      <Typography component="li" variant="body1">Sistemimize zarar verebilecek eylemlerden kaçınmalısınız</Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>4. İçerik Sorumluluğu</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Platformda paylaştığınız içerikten (şikayetler, yorumlar, kanıtlar vb.) siz sorumlusunuz. Şikayetimvar, kullanıcıların paylaştığı içeriklerin doğruluğunu garanti etmez ve bu içeriklerden dolayı sorumlu tutulamaz.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>5. Fikri Mülkiyet</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Platformdaki tüm içerik, tasarımlar ve kodlar Şikayetimvar&apos;a aittir. Başkalarının fikri mülkiyet haklarını ihlal eden içerikler paylaşmamalısınız.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>6. Puan ve Rütbe Sistemi</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Platformda aktif olarak katılım sağlayan kullanıcılara puan ve rütbe verilir. Bu sistem, kullanıcıların platformdaki katkılarını ödüllendirmek için tasarlanmıştır. Kurallara aykırı davranışlar puan kaybına neden olabilir.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>7. Yaptırımlar</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Bu koşulları ihlal eden kullanıcıların hesapları askıya alınabilir veya tamamen kapatılabilir. Ayrıca, yasal işlem başlatılabilir.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>8. Değişiklikler</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Şikayetimvar, bu kullanım koşullarını zaman zaman güncelleyebilir. Önemli değişiklikler size bildirilecektir. Platformu kullanmaya devam ederek güncellenmiş koşulları kabul etmiş sayılırsınız.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>9. İletişim</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Bu kullanım koşulları hakkında sorularınız için info@sikayetimvar.com adresinden bize ulaşabilirsiniz.
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
