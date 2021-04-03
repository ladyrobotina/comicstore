import React from "react";
import {GetStaticProps} from "next";
import {Button, Flex, Grid, Image, Link, Stack, Text} from "@chakra-ui/react";
import {motion, AnimatePresence, AnimateSharedLayout} from 'framer-motion';

import {Product} from "../product/types";
import api from "../product/api";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({products}) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<string>(null);
  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
          ``,
        )
        .concat(
          `\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`,
        ),
    [cart],
  );

  return (
    <AnimateSharedLayout type="crossfade">
      <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            key={product.id}
            backgroundColor="gray.100"
            borderRadius="md"
            padding={4}
            spacing={3}
          >
            <Stack spacing={1}>
              <Image alt={product.title} as={motion.img} cursor="pointer" layoutId={product.image} src={product.image} onClick={() => setSelectedImage(product.image)} />
              <Text>{product.title}</Text>
              <Text color="green.500" fontSize="sm" fontWeight="500">
                {parseCurrency(product.price)}
              </Text>
            </Stack>
            <Button
              colorScheme="primary"
              size="sm"
              variant="outline"
              onClick={() => setCart((cart) => cart.concat(product))}
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
          <Button
            isExternal
            as={Link}
            colorScheme="whatsapp"
            href={`https://wa.me/5491141414141?text=${encodeURIComponent(text)}`}
            width="fit-content"
            leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff" />}
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      )}
    </Stack>
    <AnimatePresence>
      {selectedImage && 
      <Flex key="backdrop" alignItems="center" as={motion.div} backgroundColor="rgba(0,0,0,0.5)" justifyContent="center" layoutId={selectedImage} position="fixed" top={0} left={0} height="100vh" width="100vh" onClick={() => setSelectedImage(null)}>
        <Image key="image" src={selectedImage} />
        </Flex>}
    </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default IndexRoute;