import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import styled from "styled-components";
import { format } from "date-fns";

// สร้างสไตล์สำหรับ TableRow เมื่อมีการ hover
const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f5f5f5;
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }
`;

const Products = () => {
  // ประกาศ state สำหรับจัดการข้อมูลต่างๆ
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    rating: "",
    stock: "",
  });
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  // ใช้ useEffect เพื่อดึงข้อมูลจากเซิร์ฟเวอร์เมื่อ component ถูก mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันจัดการการค้นหา
  const handleSearch = (event) => {
    setSearchTerm(event.target.value || "");
  };

  // ฟังก์ชันจัดการการกรองราคาสินค้า
  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  // ฟังก์ชันจัดการการกรองคะแนนสินค้า
  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value.toString());
  };

  // ฟังก์ชันจัดการการลบสินค้า
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/del-products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ฟังก์ชันจัดการการรีเซ็ตข้อมูลสินค้า
  const handleReset = () => {
    axios
      .get("http://localhost:3000/fetch-products")
      .then((response) => {
        console.log("Request sent successfully:", response);
        window.location.reload(); // รีเฟรชหน้าเว็บ
      })
      .catch((error) => {
        console.error("There was an error sending the request:", error);
      });
  };

  // ฟังก์ชันจัดการการแก้ไขสินค้า
  const handleEdit = (product) => {
    setEditProduct(product);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลสินค้า
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  // ฟังก์ชันจัดการการบันทึกการแก้ไขสินค้า
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/update-products/${editProduct.id}`,
        editProduct
      );
      setProducts(
        products.map((product) =>
          product.id === editProduct.id ? response.data : product
        )
      );
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // ฟังก์ชันจัดการการยกเลิกการแก้ไขสินค้า
  const handleEditCancel = () => {
    setEditProduct(null);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลสินค้าใหม่
  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // ฟังก์ชันจัดการการบันทึกสินค้าใหม่
  const handleAddSubmit = async () => {
    try {
      const productToSubmit = {
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        stock: parseInt(newProduct.stock, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await axios.post(
        `http://localhost:3000/add-products`,
        productToSubmit
      );
      setProducts([...products, response.data]);
      setNewProduct({
        title: "",
        description: "",
        price: "",
        rating: "",
        stock: "",
      });
      setIsAddProductDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ฟังก์ชันเปิด dialog สำหรับเพิ่มสินค้าใหม่
  const handleAddClick = () => {
    setIsAddProductDialogOpen(true);
  };

  // ฟังก์ชันปิด dialog สำหรับเพิ่มสินค้าใหม่
  const handleAddCancel = () => {
    setIsAddProductDialogOpen(false);
  };

  // ฟังก์ชันกรองสินค้า
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = (product.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceFilter =
      priceFilter === "" ||
      (priceFilter === "under10" && product.price < 10) ||
      (priceFilter === "under500" && product.price < 500) ||
      (priceFilter === "over500" && product.price >= 500);
    const matchesRatingFilter =
      ratingFilter === "" ||
      (ratingFilter === "1" && product.rating >= 1 && product.rating < 2) ||
      (ratingFilter === "2" && product.rating >= 2 && product.rating < 3) ||
      (ratingFilter === "3" && product.rating >= 3 && product.rating < 4) ||
      (ratingFilter === "4" && product.rating >= 4 && product.rating < 5) ||
      (ratingFilter === "5" && product.rating >= 5);

    return matchesSearchTerm && matchesPriceFilter && matchesRatingFilter;
  });

  // แสดง loading spinner ขณะกำลังดึงข้อมูล
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>Products</h1>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
            sx={{ marginRight: 2 }}
          >
            Add Product
          </Button>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Reset
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="price-label">Price</InputLabel>
            <Select
              labelId="price-label"
              label="Price"
              value={priceFilter}
              onChange={handlePriceFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="under10">Under $10</MenuItem>
              <MenuItem value="under500">Under $500</MenuItem>
              <MenuItem value="over500">Over $500</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="rating-label">Rating</InputLabel>
            <Select
              labelId="rating-label"
              label="Rating"
              value={ratingFilter}
              onChange={handleRatingFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {[1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating.toString()}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <StyledTableRow key={product.id}>
                {/* <TableCell>{product.id}</TableCell> */}
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {format(new Date(product.updatedAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {format(new Date(product.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editProduct && (
        <Dialog open={Boolean(editProduct)} onClose={handleEditCancel}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={editProduct.title}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={editProduct.description}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              name="price"
              value={editProduct.price}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Rating"
              type="number"
              fullWidth
              name="rating"
              value={editProduct.rating}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Stock"
              type="number"
              fullWidth
              name="stock"
              value={editProduct.stock}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={isAddProductDialogOpen}
        onClose={handleAddCancel}
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={newProduct.title}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={newProduct.description}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            name="price"
            value={newProduct.price}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Rating"
            type="number"
            fullWidth
            name="rating"
            value={newProduct.rating}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            name="stock"
            value={newProduct.stock}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
