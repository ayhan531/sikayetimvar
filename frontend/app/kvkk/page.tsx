"use client";

import { Box, Container, Stack, Typography, Breadcrumbs, Link as MuiLink, Divider } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LockIcon from "@mui/icons-material/Lock";

export default function KvkkPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
              <MuiLink component={Link} href="/" underline="hover" sx={{ color: "#6B7280" }}>Ana Sayfa</MuiLink>
              <Typography sx={{ color: "#1E6E4F", fontWeight: 600 }}>KVKK Aydınlatma Metni</Typography>
            </Breadcrumbs>

            <Box sx={{ p: 4, borderRadius: 3, bgcolor: "#fff", border: "1px solid #E5E7EB", mb: 4 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#1E6E4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LockIcon sx={{ fontSize: 28, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#1F2937" }}>KVKK Aydınlatma Metni</Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>6698 Sayılı Kişisel Verilerin Korunması Kanunu</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>1. Veri Sorumlusu</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    6698 sayılı KVKK kapsamında veri sorumlusu olarak Şikayetimvar olarak kişisel verilerinizi hukuka uygun bir şekilde işlemekte, saklamakta ve aktarmaktayız.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>2. İşlenen Kişisel Veriler</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8, mb: 2 }}>
                    Platformumuzda aşağıdaki kişisel veriler işlenmektedir:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Kimlik bilgileri (ad, soyad)</Typography>
                    <Typography component="li" variant="body1">İletişim bilgileri (e-posta, telefon)</Typography>
                    <Typography component="li" variant="body1">Kullanıcı davranışları ve etkileşim verileri</Typography>
                    <Typography component="li" variant="body1">Şikayet ve içerik verileri</Typography>
                    <Typography component="li" variant="body1">Puan ve rütbe bilgileri</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>3. Kişisel Verilerin İşlenme Amaçları</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, mt: 1, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Platform hizmetlerinin sunulması</Typography>
                    <Typography component="li" variant="body1">Kullanıcı hesaplarının yönetimi</Typography>
                    <Typography component="li" variant="body1">Şikayetlerin işlenmesi ve takibi</Typography>
                    <Typography component="li" variant="body1">Puan ve rütbe sisteminin yürütülmesi</Typography>
                    <Typography component="li" variant="body1">Yasal yükümlülüklerin yerine getirilmesi</Typography>
                    <Typography component="li" variant="body1">Güvenlik ve dolandırıcılık önleme</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>4. Kişisel Verilerin Aktarılması</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verileriniz, yasal zorunluluklar dışında ve açık rızanız olmadan üçüncü taraflarla paylaşılmaz. Verileriniz, yasal yükümlülükler kapsamında yetkili kurum ve kuruluşlarla paylaşılabilir.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>5. Kişisel Veri Saklama Süresi</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca saklanır. Yasal saklama sürelerinin dolması veya işleme amacının ortadan kalkması halinde verileriniz silinir, yok edilir veya anonim hale getirilir.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>6. Veri Sahibinin Hakları</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8, mb: 2 }}>
                    KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, color: "#4B5563", lineHeight: 1.8, listStyleType: "disc" }}>
                    <Typography component="li" variant="body1">Kişisel verilerinizin işlenip işlenmediğini öğrenme</Typography>
                    <Typography component="li" variant="body1">İşlenmişse buna ilişkin bilgi talep etme</Typography>
                    <Typography component="li" variant="body1">İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</Typography>
                    <Typography component="li" variant="body1">Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</Typography>
                    <Typography component="li" variant="body1">Eksik veya yanlış işlenmişse düzeltilmesini isteme</Typography>
                    <Typography component="li" variant="body1">Silinmesini veya yok edilmesini isteme</Typography>
                    <Typography component="li" variant="body1">Yapılan işlemlerin veri aktarılan üçüncü kişilere bildirilmesini isteme</Typography>
                    <Typography component="li" variant="body1">İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E6E4F", mb: 2 }}>7. Başvuru Yöntemi</Typography>
                  <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.8 }}>
                    KVKK kapsamındaki haklarınızı kullanmak için info@sikayetimvar.com adresine e-posta gönderebilir veya yazılı başvurunuzu adresimize iletebilirsiniz.
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
