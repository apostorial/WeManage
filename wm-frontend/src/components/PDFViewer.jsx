import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '../styles/PDFViewer.css';

const workerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const PDFViewer = ({ cardId }) => {
    const [PDFData, setPDFData] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                const response = await axios.get(`/api/files/card/${cardId}/pdf`, {
                    responseType: 'blob',
                });

                const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setPDFData(url);
            } catch (error) {
                console.error('Error fetching the PDF:', error);
            }
        };

        fetchPDF();
    }, [cardId]);

    return (
        <div style={{ width: '700px' }}>
            {PDFData ? (
                <Worker workerUrl={workerUrl}>
                    <Viewer fileUrl={PDFData} plugins={[defaultLayoutPluginInstance]} />
                </Worker>
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    );
};

export default PDFViewer;