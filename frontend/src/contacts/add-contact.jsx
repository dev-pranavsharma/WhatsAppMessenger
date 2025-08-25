import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'


const AddContact = () => {
  const form = useForm({
    defaultValues:{
      name:null,
      countryCode:null,
      phone_number:null
    }
  }
  )
  console.log(form);
  
  return (
    <>
        <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Card>
        <CardHeader>
        <CardTitle>Add contact</CardTitle>
        <CardDescription>Fill the details of the contact</CardDescription>
        </CardHeader>
        <CardContent>
                <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input  placeholder="rahul sharma" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
    </Form>
        </CardContent>
    </Card>
    </>
  )
}

export default AddContact