"use client";

import { Box, Container, Stack, Typography, Breadcrumbs, Link as MuiLink, Divider, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CookieIcon from "@mui/icons-material/Cookie";

export default function CookiePolicyPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
              <MuiLink component={Link} href="/" underline="hover" sx={{ color: "#6B7280" }}>Ana Sayfa</MuiLink>
              <Typography sx={{ color: "#1E6E4F", fontWeight: 600 }}>Çerez Politikası</Typography>
            </Breadcrumbs>

            <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#fff", border: "1px solid #E5E7EB", mb: 4 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#1E6E4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CookieIcon sx={{ fontSize: 28, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#1F2937" }}>Çerez Politikası</Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>Son güncelleme: 1 Ocak 2026</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>1. Çerez Nedir?</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Çerezler, web sitelerinin tarayıcınızda depoladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi tanımasını, tercihlerinizi hatırlamasını ve size daha iyi bir deneyim sunmasını sağlar.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>2. Kullandığımız Çerez Türleri</Typography>
                  <Table sx={{ mt: 2 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Çerez Türü</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Amaç</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Süre</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Oturum Çerezleri</strong></TableCell>
                        <TableCell>Oturumunuzu yönetmek ve güvenliğinizi sağlamak</TableCell>
                        <TableCell>Oturum süresince</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Tercih Çerezleri</strong></TableCell>
                        <TableCell>Dil, tema ve diğer tercihlerinizi hatırlamak</TableCell>
                        <TableCell>1 yıl</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Analitik Çerezler</strong></TableCell>
                        <TableCell>Web sitesi trafiğini ve kullanımını analiz etmek</TableCell>
                        <TableCell>2 yıl</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>İşlevsel Çerezler</strong></TableCell>
                        <TableCell>Gelişmiş özellikler ve kişiselleştirme</TableCell>
                        <TableCell>1 yıl</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>3. Çerezlerin Kullanım Amaçları</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8, mb: 2 }}>
                    Çerezleri aşağıdaki amaçlarla kullanıyoruz:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1"><strong>Oturum Yönetimi:</strong> Giriş yapmanızı sağlamak ve oturumunuzu açık tutmak</Typography>
                    <Typography component="li" variant="body1"><strong>Tercihler:</strong> Dil, tema ve diğer ayarlarınızı hatırlamak</Typography>
                    <Typography component="li" variant="body1"><strong>Güvenlik:</strong> Hesabınızı ve verilerinizi korumak</Typography>
                    <Typography component="li" variant="body1"><strong>Analitik:</strong> Web sitemizin nasıl kullanıldığını anlamak</Typography>
                    <Typography component="li" variant="body1"><strong>Performans:</strong> Web sitesi hızını ve işlevselliğini artırmak</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>4. Çerezleri Yönetme</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8, mb: 2 }}>
                    Çerezleri tarayıcı ayarlarınızdan kontrol edebilir ve silebilirsiniz. Ancak bazı çerezleri devre dışı bırakmak, web sitesinin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    <strong>Popüler tarayıcılar için çerez ayarları:</strong>
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, mt: 1, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1"><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</Typography>
                    <Typography component="li" variant="body1"><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</Typography>
                    <Typography component="li" variant="body1"><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</Typography>
                    <Typography component="li" variant="body1"><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>5. Üçüncü Taraf Çerezleri</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Web sitemiz, hizmetlerimizi analiz etmek ve iyileştirmek için üçüncü taraf analitik araçları kullanabilir. Bu araçlar kendi çerezlerini yerleştirebilir. Üçüncü taraf çerezleri hakkında daha fazla bilgi için ilgili hizmet sağlayıcıların gizlilik politikalarını inceleyebilirsiniz.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>6. Değişiklikler</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Bu çerez politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>7. İletişim</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Çerez politikamız hakkında sorularınız için info@sikayetimvar.com adresinden bize ulaşabilirsiniz.
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
