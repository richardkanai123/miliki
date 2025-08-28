'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Property } from '@/generated/prisma'
import PropertyLink from './PropertyLink'

interface PropertyGridProps {
    properties: Property[]
    className?: string
}

const PropertyGrid = ({
    properties,
    className = ""
}: PropertyGridProps) => {
    const containerMotion = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <motion.div
            key="properties"
            variants={containerMotion}
            initial="hidden"
            animate="visible"
            className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5  gap-4 auto-rows-fr ${className}`}
        >
            {properties.map((property) => (
                <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex"
                >
                    <PropertyLink property={property} />
                </motion.div>
            ))}
        </motion.div>
    )
}

export default PropertyGrid
